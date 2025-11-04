package com.example.flim.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;

import javax.persistence.Column;
import javax.persistence.Lob;

import java.util.*;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
public class MovieAlgo {
	    @Column(name = "ID")
        private int id;	
        @Column(name = "title")
	    private String title;

        @Column(name = "overview")
	    private String overview;
        
        @Column(name = "genre_ids")
	    private String genre_ids;
        
        private String keyword;
        
        private String poster_path;
        
        private Double Similarity;
        
	    // 생성자
        public MovieAlgo(int id, String title, String overview, String genre_ids, String keyword) {
            this.id = id;
            this.title = title;
            this.overview = overview;
            this.genre_ids = genre_ids;
            this.keyword = keyword;
        }
        
   
	    // Getter, Setter
	    public String getTitle() {
	        return title;
	    }

	    public void setTitle(String title) {
	        this.title = title;
	    }

	    public String getOverview() {
	        return overview;
	    }

	    public void setOverview(String overview) {
	        this.overview = overview;
	    }



	}