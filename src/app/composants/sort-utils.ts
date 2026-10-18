export interface SortState {
  column: string;
  direction: 'asc' | 'desc';
}

/**
 * Les dates arrivent de l'API en ISO (« 2026-10-13T04:04:18.061462Z »).
 * parseFloat n'en lit que l'année (2026) : toutes les dates d'une même année
 * deviennent égales et le tri par date ne bouge plus. On les compare donc
 * comme des dates avant de tomber sur la comparaison numérique.
 */
function toComparable(value: unknown): number | string | null {
  if (value == null) {
    return null;
  }
  if (value instanceof Date) {
    return value.getTime();
  }
  if (typeof value === 'string') {
    // Forme ISO ou AAAA-MM-JJ : le tiret après quatre chiffres distingue une
    // date d'un nombre simple (un code postal « 75001 » n'en a pas).
    if (/^\d{4}-\d{2}-\d{2}([T ]|$)/.test(value)) {
      const t = new Date(value).getTime();
      if (!isNaN(t)) {
        return t;
      }
    }
    return value;
  }
  return value as number;
}

export function sortByProperty<T>(array: T[], property: string, direction: 'asc' | 'desc'): T[] {
  const sorted = [...array];
  sorted.sort((a, b) => {
    const valA = getNestedValue(a, property);
    const valB = getNestedValue(b, property);

    if (valA === valB) return 0;

    const compA = toComparable(valA);
    const compB = toComparable(valB);

    const numA = compA != null && typeof compA !== 'string' ? compA : parseFloat(compA as any);
    const numB = compB != null && typeof compB !== 'string' ? compB : parseFloat(compB as any);
    const numericA = compA != null && !isNaN(numA);
    const numericB = compB != null && !isNaN(numB);

    if (numericA && numericB) {
      const comparison = numA - numB;
      return direction === 'asc' ? comparison : -comparison;
    }

    // Valeur numérique d'un côté, texte de l'autre : on compare le nombre à
    // la partie numérique du texte (0 si elle n'en a pas). L'ancien code
    // renvoyait la valeur brute comme comparaison, ce qui suffisait à faire
    // bouger la liste dans un sens arbitraire.
    if (numericA || numericB) {
      const comparison = (numericA ? numA : 0) - (numericB ? numB : 0);
      if (comparison !== 0) {
        return direction === 'asc' ? comparison : -comparison;
      }
    }

    const textA = String(valA ?? '');
    const textB = String(valB ?? '');
    const comparison = textA.localeCompare(textB);
    return direction === 'asc' ? comparison : -comparison;
  });
  return sorted;
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

export function matchSearch(value: unknown, search: string, isNumeric?: boolean): boolean {
  if (!search) return true;
  if (value == null) return false;

  const numValue = typeof value === 'number' ? value : Number(value);
  const operatorMatch = search.match(/^(>=?|<=?|=)?(\d+(?:\.\d+)?)$/);
  if (operatorMatch && !isNaN(numValue)) {
    const operator = operatorMatch[1] || '=';
    const threshold = parseFloat(operatorMatch[2]);
    switch (operator) {
      case '>': return numValue > threshold;
      case '>=': return numValue >= threshold;
      case '<': return numValue < threshold;
      case '<=': return numValue <= threshold;
      case '=': return numValue === threshold;
    }
  }

  if (typeof value === 'number') {
    return String(value).toLowerCase().includes(search.toLowerCase());
  }

  return String(value).toLowerCase().includes(search.toLowerCase());
}
