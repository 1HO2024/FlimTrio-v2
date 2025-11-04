package com.example.flim.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchHistory {
private String searchId;
private int userIdx;
private String query;
private String createdAt;
}
