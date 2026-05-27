export interface SortState {
  column: string;
  direction: 'asc' | 'desc';
}

export function sortByProperty<T>(array: T[], property: string, direction: 'asc' | 'desc'): T[] {
  const sorted = [...array];
  sorted.sort((a, b) => {
    const valA = getNestedValue(a, property);
    const valB = getNestedValue(b, property);

    if (valA === valB) return 0;

    const numA = valA != null ? parseFloat(valA as any) : NaN;
    const numB = valB != null ? parseFloat(valB as any) : NaN;
    const numericA = valA != null && !isNaN(numA);
    const numericB = valB != null && !isNaN(numB);

    if (numericA && numericB) {
      const comparison = numA - numB;
      return direction === 'asc' ? comparison : -comparison;
    }

    if (numericA) {
      const comparison = numA;
      return direction === 'asc' ? comparison : -comparison;
    }

    if (numericB) {
      const comparison = -numB;
      return direction === 'asc' ? comparison : -comparison;
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
