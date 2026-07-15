
package com.hackathon.DevOpsAgent.model;

public class AnalysisJob {

    private String jobId;

    private JobStatus status;

    private int progress;

    private AnalyzeResponse response;

    private String message;

    public AnalysisJob() {
    }

    public AnalysisJob(String jobId) {

        this.jobId = jobId;
        this.status = JobStatus.QUEUED;
        this.progress = 0;
        this.message = "Job queued";
    }

    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    public JobStatus getStatus() {
        return status;
    }

    public void setStatus(JobStatus status) {
        this.status = status;
    }

    public int getProgress() {
        return progress;
    }

    public void setProgress(int progress) {
        this.progress = progress;
    }

    public AnalyzeResponse getResponse() {
        return response;
    }

    public void setResponse(AnalyzeResponse response) {
        this.response = response;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}