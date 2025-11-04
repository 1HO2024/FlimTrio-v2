package com.example.flim.dto;


import javax.persistence.Column;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MovieAlgoResponse {
    @Column(name = "ID")
    private int id;	
    @Column(name = "title")
    private String title;
    private String poster_path;
    

}
