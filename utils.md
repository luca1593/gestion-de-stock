*ngFor="let mvt of listMvtStk | paginate : {
            itemsPerPage: 3,
            currentPage: page,
            totalItems: listMvtStk.length}"


s0n3R@nd0mP@$$w0rd

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

# Sécurité: Cacher les fichiers sensibles
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

