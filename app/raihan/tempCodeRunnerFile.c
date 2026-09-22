
typedef struct {
    int row;
    int col;
    int id;
    char rarity[15];
    int order; 
} Pokemon;

int get_pokemon_rarity(int val, char *rarity_out) {
    if (val <= 0) return 0; 

    if (val % 6 == 0 && val % 7 == 0) {
        strcpy(rarity_out, "Legendary");
        return 1;
    } else if (val % 7 == 0) {
        strcpy(rarity_out, "Rare");
        return 1;
    } else if (val % 6 == 0) {
        strcpy(rarity_out, "Common");
        return 1;
    }
    return 0;
}

int get_priority(const char *rarity) {
    if (strcmp(rarity, "Legendary") == 0) return 1;
    if (strcmp(rarity, "Rare") == 0) return 2;
    if (strcmp(rarity, "Common") == 0) return 3;
    return 4;
}

int compare_pokemon(const void *a, const void *b) {
    Pokemon *p1 = (Pokemon *)a;
    Pokemon *p2 = (Pokemon *)b;

    int prio1 = get_priority(p1->rarity);
    int prio2 = get_priority(p2->rarity);

    if (prio1 != prio2) {
        return prio1 - prio2;
    }
    return p1->order - p2->order;
}

int main() {
    int R, C;
    if (scanf("%d %d", &R, &C) != 2) return 0;

    int mat[100][100];
    for (int i = 0; i < R; i++) {
        for (int j = 0; j < C; j++) {
            scanf("%d", &mat[i][j]);
        }
    }

    Pokemon list[10000];
    int count = 0;

    int r = R / 2;
    int c = C / 2;

    int dr[4], dc[4];
    if (C % 2 == 0) {
        dr[0] = 0;  dc[0] = -1; 
        dr[1] = -1; dc[1] = 0;  
        dr[2] = 0;  dc[2] = 1;  
        dr[3] = 1;  dc[3] = 0;  
    } else {
        dr[0] = -1; dc[0] = 0;  
        dr[1] = 0;  dc[1] = 1;  
        dr[2] = 1;  dc[2] = 0;  
        dr[3] = 0;  dc[3] = -1; 
    }

    int step_length = 1;
    int dir = 0;
    int visited_count = 0;

    char temp_rarity[15];

    if (r >= 0 && r < R && c >= 0 && c < C) {
        if (get_pokemon_rarity(mat[r][c], temp_rarity)) {
            list[count].row = r;
            list[count].col = c;
            list[count].id = mat[r][c];
            list[count].order = count;
            strcpy(list[count].rarity, temp_rarity);
            count++;
        }
        visited_count++;
    }

    while (visited_count < R * C) {
        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < step_length; j++) {
                r += dr[dir];
                c += dc[dir];

                if (r >= 0 && r < R && c >= 0 && c < C) {
                    if (get_pokemon_rarity(mat[r][c], temp_rarity)) {
                        list[count].row = r;
                        list[count].col = c;
                        list[count].id = mat[r][c];
                        list[count].order = count;
                        strcpy(list[count].rarity, temp_rarity);
                        count++;
                    }
                    visited_count++;
                }
            }
            dir = (dir + 1) % 4;
        }
        step_length++;
    }

    if (count == 0) {
        printf("Nggak ada Pokemon!\n");
    } else {
        // PERINTAH SORTING
        qsort(list, count, sizeof(Pokemon), compare_pokemon);

        for (int i = 0; i < count; i++) {
            printf("[%s] ID: %d pada koordinat (%d, %d)\n", list[i].rarity, list[i].id, list[i].row, list[i].col);
        }
    }
