*ngFor="let mvt of listMvtStk | paginate : {
            itemsPerPage: 3,
            currentPage: page,
            totalItems: listMvtStk.length}"