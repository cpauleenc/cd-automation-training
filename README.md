# Cretor Distribution Automation Project

[![CD Automation Test Result](https://github.com/kumumedia/test-automation-cd/workflows/cd-automation-manual/badge.svg?branch=master)](.github/workflows/api_e2e_manual.yml) [![CD Automation Build](https://github.com/kumumedia/test-automation-cd/workflows/Build/badge.svg?branch=master)](.github/workflows/build.yml)

## Overview
This is an automation repository for Creator Distribution which uses Cypress framework for both Backend(API) and Frontend(UI) web testing.

## Pre-requisites

### SDKs and other tools
Please install the following SDKs/Tools to your machine:
 - Git
 - Node/NPM

### IDE/Text editors
You can download and use the following text editors:
 - VScode
 - Sublime

## Forking CD Automation Repository
1. Navigate to [test-automation-cd](https://github.com/kumumedia/test-automation-cd)repository.
2. Click the `Fork` button.
3. Fill out the following fields:
    - Repository Name (Required)
    - Description (Optional)
4. Click `Create fork` button.
5. To verify that the repository has been fork successfully. Go to `Github Profile > Your repositories` and make sure that `test-automation-cd` is included on the list.

## Setting-up CD Automation Repository
1. Establish VCS account and .ssh key on your local.
2. Clone the forked repository
    - Go to the list of repositories in your profile and select `test-automation-cd`.
    - Click `Code` button then click the `copy` icon.
    - Open a terminal and navigate to the path where you want to save or store the `test-automation-cd` project in your local. Run this command git clone <space> and paste the github path of `test-automation-cd` forked repository.
3. In your local, navigate to the path where you cloned the test-automation-cd project then run `npm install` command.

## How to Run Tests
There are two ways in running the Cypress Framework automation tests.

### Running test via Cypress UI
1. Open a terminal and type `npx cypress open` command.
2. Select `E2E Testing` from the Cypress UI
3. Choose a browser where you want to run the tests then click the `Start E2E Testing` button.
4. Select a test you want to run by just click the specific test from the list.
5. Test result will be displayed right after running the test.

### Running test via Terminal
1. Open a terminal and run `npm test` command. After running the test, the result will be displayed.
