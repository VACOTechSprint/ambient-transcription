# VA AI Tech Sprint 4 - Provider Burnout Solution

## Update 2024-02-05:
I failed to submit the requirements before the Gate 1 deadline last Friday. Since late entries are not considered, we are effectively done with this project. We're going to leave this repo available for the time being for posterity, but do not plan on maintaining it. 

---

Welcome to the project management repository for our VA AI Tech Sprint 4 challenge entry, where we aim to tackle provider burnout through innovative AI-powered solutions. This README provides an overview of our project, instructions for contributors, and resources for our collaborators.

## About the Project

The Department of Veterans Affairs has initiated a competition to harness the potential of AI to reduce provider burnout and improve care for our veterans. Our team is developing an ambient dictation tool that intelligently transcribes and summarizes healthcare interactions, leveraging open-source technology and cloud-based solutions. 

Our goal is to create a product that not only meets the stringent requirements set forth by the VA but also embodies the principles of ethical AI and open-source collaboration.

## Project Structure
- `/cloud_functions`: Node functions deployed as Google Cloud Functions.
- `/deployment`: Terraform configuration and documentation for deploying the application to Google Cloud environments.
- `/design`: Mockups and design resources for the web application.
- `/docs`: Client requirement files
- `/frontend`: Vite/React frontend for the demo app

## Additional Dependencies
ASR: https://github.com/dahifi/whisper-asr-webservice/pull/new/fork/main
    WhisperX Diaraization Pipeline. Fork of a fork, deployed as a cloud build to Google Compute instance with GPU support. 


## Getting Started

### Prerequisites
- Google Cloud Services
- Terraform

### Installation
The Terraform deployment scripts are hard-coded to the project name, in the future we'll take steps to make sure those are abstracted to env vars, so anyone who wants to fork this will probably need to update project name, region and unique IDs for bucket, functions, and so on. 

The general installation instructions are as follows: 
    - Build the docker image of the ASR endpoint repo listed above. 
    - Run the terraform script to standup the ASR compute host with GPU. You will need to manually pull the docker image. 
    - In the frontend directory, run dev or build preview to test the front end. There is a script to deploy the files to the front-end bucket. 

The app should record audio data, send the blob to the ASR server. Transcribed text is returned to the user. 

## Contribution Guide
This repo will not be maintained any further. 

## License
FWIW, this project is released under the MIT License. 

## Contact
Feel free to reach out to one of the contacts listed on [my Github profile](https://github.com/dahifi)