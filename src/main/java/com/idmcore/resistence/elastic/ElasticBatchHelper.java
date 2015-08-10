package com.idmcore.resistence.elastic;

import org.elasticsearch.action.bulk.BulkItemResponse;
import org.elasticsearch.action.bulk.BulkProcessor;
import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.client.Client;
import org.elasticsearch.common.unit.TimeValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

/**
 * Created by jettrocoenradie on 26/06/15.
 */
@Component
public class ElasticBatchHelper implements InitializingBean, DisposableBean {
    public static final int BULK_ACTIONS_THRESHOLD = 1000;
    public static final int BULK_CONCURRENT_REQUESTS = 1;
    public static final int BULK_FLUSH_DURATION = 30;
    private static final Logger logger = LoggerFactory.getLogger(ElasticBatchHelper.class);
    @Autowired
    Client client;

    private BulkProcessor bulkProcessor;

    public void updateInBatch(IndexRequest request) {
        bulkProcessor.add(request);
    }

    public void updateInBatch(UpdateRequest request) {
        bulkProcessor.add(request);
    }

    private BulkProcessor.Listener createLoggingBulkProcessorListener() {
        return new BulkProcessor.Listener() {
            @Override
            public void beforeBulk(long executionId, BulkRequest request) {
                logger.info("Going to execute new bulk composed of {} actions", request.numberOfActions());
            }

            @Override
            public void afterBulk(long executionId, BulkRequest request, BulkResponse response) {
                logger.info("Executed bulk composed of {} actions", request.numberOfActions());
                if (response.hasFailures()) {
                    if (response.iterator().hasNext()) {
                        logger.warn("Something went wrong during the bulk.");
                        BulkItemResponse itemResponse = response.iterator().next();
                        if (itemResponse.isFailed()) {
                            logger.info("Failure in the bulk {}", itemResponse.getFailureMessage());
                        }
                    }
                }
            }

            @Override
            public void afterBulk(long executionId, BulkRequest request, Throwable failure) {
                logger.warn("Error executing bulk", failure);
            }
        };
    }

    private TimeValue createFlushIntervalTime() {
        return new TimeValue(BULK_FLUSH_DURATION, TimeUnit.SECONDS);
    }

    @Override
    public void destroy() throws Exception {
        this.bulkProcessor.flush();
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        this.bulkProcessor = BulkProcessor.builder(client,
                createLoggingBulkProcessorListener()).setBulkActions(BULK_ACTIONS_THRESHOLD)
                .setConcurrentRequests(BULK_CONCURRENT_REQUESTS)
                .setFlushInterval(createFlushIntervalTime())
                .build();

    }
}
