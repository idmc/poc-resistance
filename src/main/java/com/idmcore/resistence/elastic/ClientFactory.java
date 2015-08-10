package com.idmcore.resistence.elastic;

import org.elasticsearch.client.Client;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.ImmutableSettings;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.FactoryBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Created by jettrocoenradie on 26/06/15.
 */
@Component
public class ClientFactory implements FactoryBean<Client>, InitializingBean, DisposableBean {
    private static final Logger logger = LoggerFactory.getLogger(ClientFactory.class);
    @Value("${elastic.cluster.name}")
    String clusterName;
    @Value("${elastic.server.host}")
    String serverHost;
    @Value("${elastic.server.port}")
    int serverPort;
    private Client client;

    @Override
    public Client getObject() throws Exception {
        return client;
    }

    @Override
    public Class<?> getObjectType() {
        return Client.class;
    }

    @Override
    public boolean isSingleton() {
        return true;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        logger.info("Starting up the client to elasticsearch");
        Settings settings = ImmutableSettings.settingsBuilder()
                .put("cluster.name", clusterName)
                .build();
        logger.debug("Settings used for connection to elasticsearch : {}", settings.toDelimitedString('#'));
        logger.debug("Connecting to host:port {}:{} ", serverHost, serverPort);

        this.client = new TransportClient(settings)
                .addTransportAddress(new InetSocketTransportAddress(serverHost, serverPort));

    }

    @Override
    public void destroy() throws Exception {
        logger.info("Destroying the client to elasticsearch");
        this.client.close();
    }
}
