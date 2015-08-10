package com.idmcore.resistence.api;

import java.util.List;

/**
 * Value object used to pass to a method as a filter
 */
public class QueryFilter {
    private List<String> years;

    public List<String> getYears() {
        return years;
    }

    public void setYears(List<String> years) {
        this.years = years;
    }
}
