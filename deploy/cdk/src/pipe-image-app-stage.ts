import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { PipeImageStack } from './pipe-image-stack';

export class PipeImageAppStage extends Stage {
  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id, props);

    new PipeImageStack(this, 'PipeImageStack', {});

    // The code that defines your stack goes here
  }
}