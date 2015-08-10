package com.idmcore.resistence.elastic;

import com.idmcore.resistence.api.BucketResult;
import com.idmcore.resistence.api.BucketResultItem;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.client.Client;
import org.elasticsearch.index.query.BoolFilterBuilder;
import org.elasticsearch.search.aggregations.bucket.histogram.DateHistogram;
import org.elasticsearch.search.aggregations.bucket.histogram.DateHistogramBuilder;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.aggregations.bucket.terms.TermsBuilder;
import org.elasticsearch.search.aggregations.metrics.cardinality.Cardinality;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.elasticsearch.index.query.FilterBuilders.boolFilter;
import static org.elasticsearch.index.query.FilterBuilders.termFilter;
import static org.elasticsearch.index.query.FilterBuilders.termsFilter;
import static org.elasticsearch.index.query.QueryBuilders.filteredQuery;
import static org.elasticsearch.index.query.QueryBuilders.matchAllQuery;
import static org.elasticsearch.search.aggregations.AggregationBuilders.*;

/**
 * Created by jettrocoenradie on 09/07/15.
 */
@Service
public class QueryService {

    private String indexName = "records-20150408223114";

    @Autowired
    Client client;

    public BucketResult numRecordsByYearAndUniquePatient() {
        TermsBuilder termsBuilder = terms("numRecordsByYear").field("year");

        SearchResponse searchResponse = client.prepareSearch(indexName)
                .addAggregation(termsBuilder)
                .setSearchType(SearchType.COUNT)
                .get();

        Terms agg = searchResponse.getAggregations().get("numRecordsByYear");
        List<BucketResultItem<Long>> items = agg.getBuckets().stream()
                .map(bucket -> new BucketResultItem<>(bucket.getKey(), bucket.getDocCount()))
                .collect(Collectors.toList());

        return new BucketResult("numRecordsByYear", items, searchResponse.getHits().getTotalHits());
    }

    public Map<String, BucketResult> brmoByWeek(List<String> years) {

        SearchResponse signalsSearchResponse = client.prepareSearch(indexName)
                .setQuery(filteredQuery(matchAllQuery(), boolFilter().mustNot(termFilter("signal", "geen signaal"))))
                .addAggregation(terms("signals").field("signal").size(100))
                .setSearchType(SearchType.COUNT)
                .get();

        Terms foundSignals = signalsSearchResponse.getAggregations().get("signals");

        List<String> availableSignals = foundSignals.getBuckets().stream()
                .map(bucket -> bucket.getKeyAsText().string())
                .collect(Collectors.toList());

        DateHistogramBuilder dateHisto = dateHistogram("dateHisto")
                .field("orderCreationDate")
                .interval(DateHistogram.Interval.WEEK)
                .minDocCount(0)
                .subAggregation(
                        terms("bySignal").field("signal").size(20)
                                .subAggregation(cardinality("uniquePerson").field("patientId").precisionThreshold(20000))
                );


        BoolFilterBuilder signal = boolFilter().mustNot(termFilter("signal", "geen signaal"));
        if (years.size() == 1) {
            signal.must(termFilter("year", years.get(0)));
        } else if (years.size() > 1) {
            signal.must(termsFilter("year",years));
        }
        SearchResponse searchResponse = client.prepareSearch(indexName)
                .setQuery(filteredQuery(matchAllQuery(), signal))
                .addAggregation(dateHisto)
                .setSearchType(SearchType.COUNT)
                .get();

        DateHistogram agg = searchResponse.getAggregations().get("dateHisto");
        Map<String, BucketResult> result = agg.getBuckets().stream()
                .map(bucket -> {
                    String key = bucket.getKeyAsText().string();
                    Terms signalTerms = bucket.getAggregations().get("bySignal");
                    Map<String, Long> theResults = new HashMap<>();
                    signalTerms.getBuckets().stream()
                            .forEach(bucket1 -> {
                                Cardinality cardinality = bucket1.getAggregations().get("uniquePerson");
                                Long numPersons = cardinality.getValue();
                                theResults.put(bucket1.getKeyAsText().string(), numPersons);
                            });
                    List<BucketResultItem<Long>> items = availableSignals.stream()
                            .map(s -> {
                                if (!theResults.containsKey(s)) {
                                    return new BucketResultItem<>(s, 0l);
                                } else {
                                    return new BucketResultItem<>(s, theResults.get(s));
                                }
                            })
                            .collect(Collectors.toList());
                    return new BucketResult(key, items, 0);
                })
                .collect(Collectors.toMap(BucketResult::getIdentifier, (c) -> c));
//        Map<String,BucketResult> result = agg.getBuckets().stream()
//                .map(bucket -> {
//                    String key = bucket.getKeyAsText().string();
//                    Terms signalTerms=bucket.getAggregations().get("bySignal");
//                    List<BucketResultItem<Long>> signals = signalTerms.getBuckets().stream()
//                            .map(signalBucket -> {
//                                Cardinality cardinality = signalBucket.getAggregations().get("uniquePerson");
//                                return new BucketResultItem<>(signalBucket.getKeyAsText().string(),cardinality.getValue());
//                            })
//                            .collect(Collectors.toList());
//                    return new BucketResult(key,signals,0);
//                }).collect(Collectors.toMap(BucketResult::getIdentifier,(c)->c));

        return result;
    }
}
