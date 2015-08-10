package com.idmcore.resistence;

import com.idmcore.resistence.api.BucketResult;
import com.idmcore.resistence.api.QueryFilter;
import com.idmcore.resistence.elastic.QueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

/**
 * Created by jettrocoenradie on 09/07/15.
 */
@Controller
@RequestMapping("/api")
@ResponseBody
public class ApiController {

    @Autowired
    QueryService queryService;

    @RequestMapping("/numRecordsByYear")
    public BucketResult numRecordsByYear() {
        return queryService.numRecordsByYearAndUniquePatient();
    }

    @RequestMapping(value = "/numUniquePatientsByBRMO", method = RequestMethod.POST)
    public Map<String,BucketResult> numUniquePatientsByBRMO(@RequestBody QueryFilter filter) {
        return queryService.brmoByWeek(filter.getYears());
    }

}
