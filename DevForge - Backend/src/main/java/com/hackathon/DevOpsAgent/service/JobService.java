package com.hackathon.DevOpsAgent.service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.hackathon.DevOpsAgent.model.AnalysisJob;
import com.hackathon.DevOpsAgent.model.AnalyzeResponse;
import com.hackathon.DevOpsAgent.model.JobStatus;

@Service
public class JobService {

    private final Map<String, AnalysisJob> jobs =
            new ConcurrentHashMap<>();

    public AnalysisJob createJob() {

        String id = UUID.randomUUID().toString();

        AnalysisJob job = new AnalysisJob(id);

        jobs.put(id, job);

        return job;
    }

    public AnalysisJob getJob(String id) {

        return jobs.get(id);
    }

    public void updateStatus(
            String id,
            JobStatus status,
            int progress,
            String message) {

        AnalysisJob job = jobs.get(id);

        if (job == null) {
            return;
        }

        job.setStatus(status);
        job.setProgress(progress);
        job.setMessage(message);
    }

    public void completeJob(
            String id,
            AnalyzeResponse response) {

        AnalysisJob job = jobs.get(id);

        if (job == null) {
            return;
        }

        job.setStatus(JobStatus.COMPLETED);
        job.setProgress(100);
        job.setMessage("Analysis completed");
        job.setResponse(response);
    }

    public void failJob(
            String id,
            String error) {

        AnalysisJob job = jobs.get(id);

        if (job == null) {
            return;
        }

        job.setStatus(JobStatus.FAILED);
        job.setMessage(error);
    }
}