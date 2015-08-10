package com.idmcore.resistence.elastic;

import org.elasticsearch.search.SearchHit;

/**
 * Created by jettrocoenradie on 26/06/15.
 */
public class HitToDocumentMapper {
    private String index;
    private String type;
    private String idField;

    public HitToDocumentMapper(String index, String type, String idField) {
        this.index = index;
        this.type = type;
        this.idField = idField;
    }

    public Object map(SearchHit hit) {

        return hit.getSource();
    }

    public String index() {
        return index;
    }

    public String type() {
        return type;
    }

    public String idField() {
        return idField;
    }
}
