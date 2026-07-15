package com.hackathon.DevOpsAgent.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hackathon.DevOpsAgent.model.JobStatus;
import com.hackathon.DevOpsAgent.model.AnalyzeResponse;
import com.hackathon.DevOpsAgent.util.FileScannerUtil;
import com.hackathon.DevOpsAgent.util.GitUtil;
import com.hackathon.DevOpsAgent.util.HashUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AnalyzeService {

    @Autowired
    private AIService aiService;

    @Autowired
    private CacheService cacheService;

    @Autowired
    private ValidationService validationService;

    @Autowired
    private FileDecisionEngine fileDecisionEngine;

    @Autowired
    private JobService jobService;

    private final ObjectMapper mapper = new ObjectMapper();

    public AnalyzeResponse analyze(String input) {

        try {

            String path;

            if (input.startsWith("http")) {

                path = GitUtil.cloneRepo(input);

                System.out.println("Repository Path = " + path);

                if (path == null) {
                    return new AnalyzeResponse(
                            false,
                            null,
                            null,
                            null,
                            null,
                            "Repository clone failed"
                    );
                }

            } else {
                path = input;
            }

            Map<String, String> detected = FileScannerUtil.detectStack(path);

            String summary = FileScannerUtil.getSummary(path)
                    + "\nDetected Stack: " + detected;

            String hash = HashUtil.generateHash(summary);

            if (cacheService.contains(hash)) {

                System.out.println("===== CACHE HIT =====");

                return cacheService.get(hash);
            }

            System.out.println("===== DETECTED STACK =====");
            System.out.println(detected);
            System.out.println("==========================");

            String aiResponse = aiService.generateCompleteDevOpsSolution(summary);

            System.out.println("===== AI RESPONSE =====");
            System.out.println(aiResponse);
            System.out.println("=======================");

            if (aiResponse == null ||
                    aiResponse.isBlank() ||
                    aiResponse.equals("AI_ERROR")) {

                return new AnalyzeResponse(
                        false,
                        null,
                        null,
                        null,
                        null,
                        "AI returned empty response"
                );
            }

            aiResponse = aiResponse
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();

            AnalyzeResponse response = mapper.readValue(
                    aiResponse,
                    AnalyzeResponse.class
            );

            validationService.validate(response);

            response.setRequiredFiles(
                    fileDecisionEngine.decideFiles(detected)
            );

            response.setSuccess(true);

            cacheService.save(hash, response);

            return response;

        } catch (Exception e) {

            e.printStackTrace();

            return new AnalyzeResponse(
                    false,
                    null,
                    null,
                    null,
                    null,
                    e.getMessage()
            );
        }
    }

   

  public void runAnalysis(String jobId, String input) {

    try {

        String path;

        // ---------------------------
        // STEP 1 : Prepare Project
        // ---------------------------

        jobService.updateStatus(
                jobId,
                JobStatus.CLONING,
                20,
                "Preparing project"
                
        );
        Thread.sleep(4000);

        if (input.startsWith("http")) {

            path = GitUtil.cloneRepo(input);

            if (path == null) {

                jobService.failJob(
                        jobId,
                        "Repository clone failed"
                );

                return;
            }

        } else {

            path = input;
        }

        // ---------------------------
        // STEP 2 : Analyze Project
        // ---------------------------

        jobService.updateStatus(
                jobId,
                JobStatus.ANALYZING,
                40,
                "Analyzing project structure"
        );
        Thread.sleep(4000);

        Map<String, String> detected =
                FileScannerUtil.detectStack(path);

        String summary =
                FileScannerUtil.getSummary(path)
                        + "\nDetected Stack: "
                        + detected;

        // ---------------------------
        // STEP 3 : Detect Tech Stack
        // ---------------------------

        jobService.updateStatus(
                jobId,
                JobStatus.DETECTING_STACK,
                60,
                "Detecting technology stack"
        );
        Thread.sleep(4000);

        String hash =
                HashUtil.generateHash(summary);

        if (cacheService.contains(hash)) {

            jobService.completeJob(
                    jobId,
                    cacheService.get(hash)
            );

            return;
        }

        // ---------------------------
        // STEP 4 : Generate DevOps Files
        // ---------------------------

        jobService.updateStatus(
                jobId,
                JobStatus.GENERATING,
                80,
                "Generating DevOps configuration"
        );
        Thread.sleep(4000);

        String aiResponse =
                aiService.generateCompleteDevOpsSolution(summary);

        if (aiResponse == null
                || aiResponse.isBlank()
                || aiResponse.equals("AI_ERROR")) {

            jobService.failJob(
                    jobId,
                    "AI returned empty response"
            );

            return;
        }

        aiResponse = aiResponse
                .replace("```json", "")
                .replace("```", "")
                .trim();

        AnalyzeResponse response =
                mapper.readValue(
                        aiResponse,
                        AnalyzeResponse.class
                );

        // ---------------------------
        // STEP 5 : Validate
        // ---------------------------

        jobService.updateStatus(
                jobId,
                JobStatus.VALIDATING,
                90,
                "Validating generated configuration"
        );
        Thread.sleep(2000);

        validationService.validate(response);

        response.setRequiredFiles(
                fileDecisionEngine.decideFiles(detected)
        );

        response.setSuccess(true);

        cacheService.save(hash, response);

        // ---------------------------
        // STEP 6 : Complete
        // ---------------------------

        jobService.completeJob(
                jobId,
                response
        );

    }

    catch (Exception e) {

        e.printStackTrace();

        jobService.failJob(
                jobId,
                e.getMessage()
        );
    }
}
}