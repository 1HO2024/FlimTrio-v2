package com.example.flim.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RelatedSearchResponse {
    private String query;
    private List<Movie> movies;
    private List<String> relatedQueries;
}
