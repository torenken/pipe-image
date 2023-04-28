import { App, Tags } from 'aws-cdk-lib';
import { PipeImagePipelineStack } from './pipe-image-pipeline-stack';

const app = new App();

Tags.of(app).add('domain', 'pipe-image');
Tags.of(app).add('owner', 'torenken');

new PipeImagePipelineStack(app, 'PipeImagePipelineStack', {});

app.synth();