import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { PipeImagePipelineStack } from '../src/pipe-image-pipeline-stack';

test('PipeImagePipelineStackSnapshot', () => {

  const app = new App({
    context: {
      'aws:cdk:bundling-stacks': ['NoStack'], //disable bundling lambda (asset), by using dummy stack-name (=> reduce the unit-test-time. jest-booster)
      '@aws-cdk/core:newStyleStackSynthesis': 'true',
    },
  });

  const stack = new PipeImagePipelineStack(app, 'PipeImagePipelineStack', { });

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});