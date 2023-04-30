import { SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import { LinuxBuildImage } from 'aws-cdk-lib/aws-codebuild';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { PipeImageAppStage } from './pipe-image-app-stage';

export class PipeImagePipelineStack extends Stack {

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'PipeImagePipeline', {
      dockerEnabledForSynth: true,
      pipelineName: 'PipeImagePipeline',
      crossAccountKeys: false,

      codeBuildDefaults: {
        buildEnvironment: {
          buildImage: LinuxBuildImage.STANDARD_6_0
        },
      },

      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('torenken/pipe-image', 'main', {
          authentication: SecretValue.secretsManager('github_token'),
        }),
        commands: [
          'cd deploy/cdk',
          'yarn install --frozen-lockfile',
          'yarn cdk synth',
        ],
        primaryOutputDirectory: 'deploy/cdk/cdk.out',
      }),
    });

    const devStage = new PipeImageAppStage(this, 'Dev', {});
    pipeline.addStage(devStage);

  }
}