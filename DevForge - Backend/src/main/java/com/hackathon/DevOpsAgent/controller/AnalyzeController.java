package com.hackathon.DevOpsAgent.controller;

import java.util.Map;

import com.hackathon.DevOpsAgent.model.AnalysisJob;
import com.hackathon.DevOpsAgent.service.AnalysisExecutor;
import com.hackathon.DevOpsAgent.service.JobService;
import com.hackathon.DevOpsAgent.util.FileUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class AnalyzeController {

    @Autowired
    private JobService jobService;

    @Autowired
    private AnalysisExecutor analysisExecutor;

    @PostMapping("/analyze")
    public Map<String, String> analyze(
            @RequestBody Map<String, String> req
    ) {

        AnalysisJob job = jobService.createJob();

        analysisExecutor.startAnalysis(
                job.getJobId(),
                req.get("input")
        );

        return Map.of(
                "jobId",
                job.getJobId()
        );
    }

    @PostMapping("/analyzeZip")
    public Map<String, String> analyzeZip(
            @RequestParam("file") MultipartFile file
    ) {

        String path = FileUtil.unzip(file);

        if (path == null) {

            throw new RuntimeException(
                    "ZIP extraction failed"
            );
        }

        AnalysisJob job = jobService.createJob();

        analysisExecutor.startAnalysis(
                job.getJobId(),
                path
        );

        return Map.of(
                "jobId",
                job.getJobId()
        );
    }

    @GetMapping("/status/{jobId}")
    public AnalysisJob getJob(
            @PathVariable String jobId
    ) {

        return jobService.getJob(jobId);

    }
}