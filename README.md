# Next Generation Recruitment Platform - Architecture

## What is Next Generation Recruitment Platform (NGRP)?
NGRP is a a web-based software application that offers a comprehensive suite of tools and features designed to help recruiters and hiring managers streamline their hiring process. At it core, NGRP provide a centralized hub for recruiters to manage job postings, resumes, and candidate communication. 

NGRP help organizations attract and hire top talent through features like job board integrations, candidate tracking, communication tools, and more. 



## How will we design NGRP?
I have divided the design of NGRP into four lessons:

Requirements: This lesson will put forth the functional and non-functional requirements of NGRP.
Design: This lesson will explain the workflow and usage of each component, API design and database schema.
Detailed design: In this lesson, we’ll explore the components of our NGRP design in detail and discuss various approaches to generate timelines. Moreover, we’ll also evaluate our proposed design.
Quiz: This lesson will test our understanding of the NGRP design.


## Requirements

We’ll concentrate on some important features of NGRP to make this design simple. Let’s list down the requirements for our system:

### Functional requirements
Employers (Users)
Profile management: Enable employers to create and manage profiles, including company profiles, job listings, and application status tracking.
Job Posting Analytics: Providing employers with analytics related to their job postings, including impressions, applications, and applicant demographics to help them improve their hiring practices systematically.

Applicants (Users)
Profile management: Enable applicants to create and manage customizable profiles
Job Application Track: Allow job seekers to track the status of their job application, and provide additional information on whether they are being screened, accepted, or denied.
Recommended actions: Use user information and application history to recommend appropriate job listings to job seekers, improving job matching accuracy.
Skill-matching algorithm: Develop a skill-matching algorithm to match applicants with the right job listings based on their skills and qualifications.

Others
Messaging System: Implement a messaging system that allows job seekers and employers to communicate directly within the platform about job opportunities and applications.
User analytics and ratings: Allow users (job seekers and employers) to review and rate each other based on their experience, increasing the insight and trustworthiness of the inside of the platform does not increase.
Compensation Negotiation Forum: Provide a forum for job seekers and employers to negotiate compensation and benefits to facilitate fair and transparent communication.
Interview Scheduler: An integrated interview scheduling system that allows employers to schedule interviews with applicants directly through the platform.




### Non-functional requirements#
Scalability: The system should be scalable to handle millions of users in terms of computational resources and storage.

Latency: The latency to generate a course feed should be low.

Availability: The system should be highly available.

Durability Any uploaded content (photos and videos) should never get lost.

Consistency: We can compromise a little on consistency. It is acceptable if the courses takes time to show in followers’ feeds located in a distant region.

Reliability: The system must be able to tolerate hardware and software failures.


## Building blocks we will use#
We’ll focus on the high-level design of NGRP. The design will utilize the following building blocks in our design:

A load balancer at various layers will ensure smooth requests distribution among available servers.
A database is used to store the user, students, courses, and accounts metadata and relationship among them.
Blob storage is needed to store the various types of content such as photos, videos, slides and so on.
A cache stores the most frequent content related requests.
CDN is used to effectively deliver content to end-users which reduces delay and burden on end-servers.
compute servers
web and app servers



### High-level design
Our system should allow us to create, view, search and assess jobs at a high level. To create jobs, we need to upload and store job content, and upon fetching, we need to retrieve the data from the storage.

workflow:
Posting jobs:

Applying to jobs:

Company Ranking system:

Recommendation system:

Search feature:


### API design
This section describes APIs invoked by the users to perform different tasks (upload, like, and view courses, create and take test, view progress,  ) on NGRP. We’ll implement REST APIs for these tasks. Let’s develop APIs for each of the following features:


Post a job
Apply to job
review on employers/company
Search



All of the following calls will have a userID, that uniquely specifies the user performing the action. We’ll only discuss new parameters in the calls.

#### Post a job

The POST method of HTTP is used to call the /postJob API:

postJob(user_id, job_content)

    - job_content( employer_id,  title,  description, qualification, complimentary_qualification, job_type, visa_sponsorship, remote_posible, preferred_timezones, location, salary, date_posted, relocation, skills, employer_hiring_contact )

| Parameter | Description |
| ---------------------------------- | ---------------------------------- |
| employer_id                | Identifier of the employer posting the job.             |
| title                | Course topic and sub topic              |
| description                | Description of the job.            |
| location                | Location of the job.             |
| salary                | Salary offered for the job.              |


<!-- course content -->
<!-- course_content: {
    section: string
    subsection: {
        topic: string,
        content_type: video|pdf|slide,
    }[]
}[] -->

#### Apply to job

The POST method of HTTP is used to call the /postJobApplication API:

postJobApplicationr(user_id, job_id, application_text, resume, cover_letter, referral_information)


| Parameter | Description |
| ---------------------------------- | ---------------------------------- |
| application_text               | Applicants introduction        |
| resume               | a pdf or word resume document       |
| cover_letter               | a pdf or word document       |




#### Search jobs
The GET method is used to get course from the server through the /searchJob API. The /searchJob API is as follows:

searchJob(keyword)

| Parameter | Description |
| ---------------------------------- | ---------------------------------- |
| keyword               | keyword could be title of job, category or caption        |




#### Create Review
The POST method is used to post Review to the server from the user through the /postReview API. The /postReview API is as follows:

postReview(userID, job_id, rating, review_topic, review_text)

| Parameter | Description |
| ---------------------------------- | ---------------------------------- |
| user_id         | It indicates the id of employer   |
| rating                | Title of each sub topic               |
| review_topic                | Title of review              |
| review_text              | User comment for the compaany applied or worked             |


#### View Reviews
The GET method is used to get Review from the server through the /getReviews API. The /getReviews API is as follows:

getReviews(userID, employer_iD)

| Parameter | Description |
| ---------------------------------- | ---------------------------------- |
| job_id         | The unique ID of the job   |

<!-- 
#### View User Progres (Tracking)
The POST method is used to post photos/videos to the server from the user through the /postCourse API. The /postCourse API is as follows:

getProgress(userID, job_id)

| Parameter | Description |
| ---------------------------------- | ---------------------------------- |
| job_id         | The unique ID of the course   |
 -->


#### View General Performance
The GET method is used to get data about courses to the user using the userID from the server. The getGeneralPerformance API is as follows:

getGeneralPerformance(userID, job_id)






## Storage schema
Let’s define our data model now:

Relational or non-relational database#
It is essential to choose the right kind of database for our NGRP system, but which is the right choice — SQL or NoSQL? Our data is inherently relational, and we need an order for the data (posts should appear in chronological order) and no data loss even in case of failures (data durability). Moreover, in our case, we would benefit from relational queries like fetching the followers or images based on a user ID. Hence, SQL-based databases fulfill these requirements.

So, we’ll opt for a relational database and store our relevant data in that database.

### Define tables#
On a basic level, we need the following tables:

Users: This stores all user-related data such as ID, name, email, bio, location, date of account creation, time of the last login, and so on.

Job Listing: This stores all job informatin such as job title, location, description, salary and so on.  We also need to keep the user ID to determine which job posting belongs to which user. The user ID is a foreign key from the users table.

Messages: This stores all message information such as message text, sender, receiver, timestamp, and so on. We also need to keep the user ID to determine which message belongs to which user. The user ID is a foreign key from the users table.

Applications: This stores all application-related information such as ID, location, caption, time of creation, and so on. We also need to keep the user ID to determine which application belongs to which user. The user ID is a foreign key from the users table.




#### Entities and Attributes of the Online Job Search and Recruitment Platform
1. Users:
user_id (Primary Key): Unique identifier for each user.
username: Username of the user.
email: Email address of the user.
password: Encrypted password of the user.
role: Role of the user (job seeker or employer).
2. Job Listings:
job_id (Primary Key): Unique identifier for each job listing.
employer_id (Foreign Key referencing Users): Identifier of the employer posting the job.
title: Title of the job listing.
description: Description of the job.
location: Location of the job.
salary: Salary offered for the job.
3. Applications:
application_id (Primary Key): Unique identifier for each job application.
job_id (Foreign Key referencing Job Listings): Identifier of the job listing to which the application is made.
user_id (Foreign Key referencing Users): Identifier of the user (job seeker) who made the application.
status: Status of the application (e.g., pending, accepted, rejected).
4. Messages:
message_id (Primary Key): Unique identifier for each message.
sender_id (Foreign Key referencing Users): Identifier of the user sending the message.
receiver_id (Foreign Key referencing Users): Identifier of the user receiving the message.
message_text: Text of the message.
timestamp: Timestamp of when the message was sent.


#### Relationships Between These Entities
1. Job Listings to Employers Relationship:
One-to-many relationship: Each employer can post multiple job listings.
Foreign key: employer_id in JobListings table referencing user_id in Users table.
2. Applications to Job Listings Relationship:
One-to-many relationship: Each job listing can receive multiple applications.
Foreign keys: job_id in Applications table referencing job_id in JobListings table, user_id in Applications table referencing user_id in Users table.
3. Messages between Users Relationship:
One-to-many relationship: Each user can send and receive multiple messages.
Foreign keys: sender_id and receiver_id in Messages table referencing user_id in Users table.


### ER Diagram for Online Job Search and Recruitment Platforms

### Entities Structures in SQL Format

-- Create Users table
CREATE TABLE Users (
    user_id INT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- Create JobListings table
CREATE TABLE JobListings (
    job_id INT PRIMARY KEY,
    employer_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    salary DECIMAL(10, 2),
    FOREIGN KEY (employer_id) REFERENCES Users(user_id)
);

-- Create Applications table
CREATE TABLE Applications (
    application_id INT PRIMARY KEY,
    job_id INT,
    user_id INT,
    status VARCHAR(50),
    FOREIGN KEY (job_id) REFERENCES JobListings(job_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Create Messages table
CREATE TABLE Messages (
    message_id INT PRIMARY KEY,
    sender_id INT,
    receiver_id INT,
    message_text TEXT,
    timestamp TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES Users(user_id),
    FOREIGN KEY (receiver_id) REFERENCES Users(user_id)
);


### Database Model For Online Job Search and Recruitment Platforms

## Detailed Design

### Add more components
Let’s add a few more components to our design:

Load balancer: To balance the load of the requests from the end-users.

Application servers: To host our service to the end-users.

Relational database: To store our data.

Blob storage: To store the photos and videos uploaded by the users.

databases























<!-- 


## Higher Learning Startup - DevOps 
- Time it takes for building multiple environments
- Issues we face with different environments
- Scale-Up and Scale-Down On-Demand

## Higher Learning Startup - DevOps 
- Visibility
- Stability
- Scalability
- Security
- Audit

## Higher Learning Startup - Backend
- Time it takes for building multiple environments
- Issues we face with different environments
- Scale-Up and Scale-Down On-Demand

## Higher Learning Startup - Frontend
- Visibility
- Stability
- Scalability
- Security
- Audit -->