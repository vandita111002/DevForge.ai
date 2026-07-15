package com.hackathon.DevOpsAgent.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class AnalysisExecutor {

    @Autowired
    private AnalyzeService analyzeService;

    @Async
    public void startAnalysis(
            String jobId,
            String input) {

        analyzeService.runAnalysis(jobId, input);
    }
}