package com.hackathon.DevOpsAgent.model;

public enum JobStatus {

    QUEUED,

    CLONING,

    ANALYZING,

    DETECTING_STACK,

    GENERATING,

    VALIDATING,

    COMPLETED,

    FAILED
}