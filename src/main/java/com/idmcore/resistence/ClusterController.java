package com.idmcore.resistence;

import com.idmcore.resistence.api.ClusterStatus;
import org.elasticsearch.action.admin.cluster.health.ClusterHealthResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.ClusterAdminClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/cluster")
@ResponseBody
public class ClusterController {

    @Autowired
    private Client client;

    @RequestMapping(value = "/status", method = RequestMethod.GET)
    public ClusterStatus clusterStatus() {
        ClusterHealthResponse clusterIndexHealths = obtainClusterClient().prepareHealth().execute().actionGet();
        String clusterName = clusterIndexHealths.getClusterName();
        switch (clusterIndexHealths.getStatus()) {
            case GREEN:
                return new ClusterStatus(clusterName, "success");
            case YELLOW:
                return new ClusterStatus(clusterName, "warn");
            case RED:
            default:
                return new ClusterStatus(clusterName, "danger");
        }
    }

    private ClusterAdminClient obtainClusterClient() {
        return client.admin().cluster();
    }
}
