package com.example.flim.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchResult {
    private int resultId;
    private int searchHistoryId;
    private int movieId;
    private String title;
    private String genreIds;
    private String posterPath;
    private String keyword;
}
