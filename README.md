# cfn-empty-s3-bucket

AWS CloudFormation Custom Resource Lambda to empty an S3 bucket

This project defines a NodeJS Lambda function to back a CloudFormation custom
resource that will delete objects and versions from an S3 bucket. This allows
you to automatically delete S3 buckets when you delete a stack, as only empty
buckets can be deleted.

## Installing

Prerequisites:

* Yarn 1.22 or higher (or `npm`)
* NodeJS 12.x or higher (for adding dummy objects to the bucket)

Clone the repository:

    git clone git@github.com:showaltb/cfn-empty-s3-bucket.git
    cd cfn-empty-s3-bucket

Now copy `.env.example` to `.env` and set the following variables:

* `AWS_PROFILE` - AWS CLI profile name
* `AWS_REGION` - AWS region to create the stack in
* `STACK_NAME` - CloudFormation stack to create

Then create the stack:

    yarn deploy

The included stack (`template.yml`) will create the following resources:

* `Bucket` - An (versioned) S3 bucket for testing purposes
* `EmptyS3BucketRole` - Lambda execution role giving the function permission to
  list and remove objects from the bucket.
* `EmptyS3Bucket` - Lambda function for the custom resource to empty the bucket
  on delete.
* `BucketEmptier` - A custom resource that uses the Lambda function to empty the
  bucket on delete.

## Adding Dummy Objects to the Bucket

You can add dummy objects to the bucket to test that the bucket is emptied properly
when the stack is deleted.

First, install package dependencies:

    yarn install

Then create objects with:

    yarn fill-bucket [num]

Where `num` is the number of dummy objects to create. If you don't specify a
number, the task will prompt you.

## Deleting the Stack

To delete the stack, which will invoke the custom resource to delete any objects
in the S3 bucket before deleting it:

    yarn delete-stack
