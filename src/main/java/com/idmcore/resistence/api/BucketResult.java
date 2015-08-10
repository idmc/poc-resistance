package com.idmcore.resistence.api;

import java.util.List;

/**
 * Created by jettrocoenradie on 09/07/15.
 */
public class BucketResult {
    private String identifier;
    private List<BucketResultItem<Long>> items;
    private long totalHits;

    public BucketResult(String identifier, List<BucketResultItem<Long>> items, long totalHits) {
        this.identifier = identifier;
        this.items = items;
        this.totalHits = totalHits;
    }

    public String getIdentifier() {
        return identifier;
    }

    public List<BucketResultItem<Long>> getItems() {
        return items;
    }

    public long getTotalHits() {
        return totalHits;
    }
}
