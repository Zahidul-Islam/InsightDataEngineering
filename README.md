# Making Apache Airflow even more fantastic

## Problem statement

Airflow makes developing and running ETL jobs easy. However, managing high volume tasks in Airflow at scale is very challenging. Lets make Airflow awesome by making it distributed, CI/CD compliant, auto-service recoverable. This project will also implement monitoring and alerting services that senses when a job crashes and sends the relevant information.

## Solution

- **Fault tolerance:** Spins up two Airflow schedulers running on different machines to provide fault-tolerance. 
- **CI/CD Compliance:** Every push/merge to the Airflow dag repo will be integrated and deployed automatically, without human interference
- **Automatic Service Recovery:** Airflow backend services (webserver/scheduler/workers) will be recovered automatically if they are dead or unhealthy
- **Monitoring and alerts:** Build monitoring and alerting services that senses when a job crashes and sends the relevant information (e.g., Spark job on worker X failed in task Y)

## Technologies
`Apache Airflow`, `Apache Spark`, `AWS S3`, `PostgreSQL`, `RabbitMQ`, `Celery`, `ELK Stack`, `SLACK`

## Presentation Link
https://docs.google.com/presentation/d/1njpTly_OViQD7EEeflJ_MYp93j7oRZzbeopk-RFcm5I/edit?usp=sharing
