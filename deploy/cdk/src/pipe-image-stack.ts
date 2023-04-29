import { Stack, StackProps } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { PipeImageHandler } from './pipe-image-handler';

export class PipeImageStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, 'TestBucket');

    new PipeImageHandler(this, 'Todo', {
      serviceName: 'hello-world',
      environment: {
        BUCKET: bucket.bucketName,
      },
    });
  }
}