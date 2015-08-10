package com.idmcore.resistence.api;

/**
 * Created by jettrocoenradie on 09/07/15.
 */
public class BucketResultItem<T> {
    private String key;
    private T value;

    public BucketResultItem(String key, T value) {
        this.key = key;
        this.value = value;
    }

    public String getKey() {
        return key;
    }

    public T getValue() {
        return value;
    }
}
