# OpenTelemetry (OTEL)

## :whale: Local Development with OpenTelemetry (OTEL)

To enhance your local development experience and capture traces, metrics, and logs, you can use OpenTelemetry with Docker Compose. Follow the steps below to set up OpenTelemetry for your project:

1. Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/sizzldev/ctrlplane.git
cd ctrlplane
```

2. Run the following command to start the necessary services (Jaeger, Zipkin, Prometheus, OTEL Collector):

```bash
pnpm otel:up
```

3. The services needed to get signoz and otel collector up and running will start in detached mode.

4. Visit http://localhost:3301 to view the real-time telemetry data.

5. You can now run the application with telemetry enabled and start tracking your service's performance.

```bash
pnpm dev:otel
```

To stop the services, use:

```bash
pnpm otel:down
```

Ensure your OTEL environment variables are set correctly for proper trace and metric collection in your services.

Feel free to customize the `docker-compose.otel.yaml` file to suit your needs or extend it to fit your local development workflow.
