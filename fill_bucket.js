// fill test bucket with random objects

require('dotenv').config()
const prompts = require('prompts')
const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid')

;
(async () => {

  // introspect CF stack to get bucket name
  const cloudformation = new AWS.CloudFormation()
  const resource = await cloudformation.describeStackResource({
    StackName: process.env.STACK_NAME,
    LogicalResourceId: 'Bucket'
  }).promise()
  const bucket = resource.StackResourceDetail.PhysicalResourceId

  // get number of objects to create
  let numObjects = process.argv[2]
  if (!numObjects) {
    const input = await prompts([
      {
        type: 'number',
        name: 'numObjects',
        message: 'Number of objects to create',
        initial: 20
      }
    ])
    numObjects = input.numObjects
  }

  // create dummy objects
  const s3 = new AWS.S3()
  const promises = []
  for (let i = 0; i < numObjects; i++) {
    if (promises.length >= 50) {
      await Promise.all(promises)
      promises.splice(0)
    }
    const uuid = uuidv4()
    console.log(`${i + 1}: ${uuid}`)
    promises.push(s3.putObject({
      Bucket: bucket,
      Key: uuid,
      Body: uuid
    }).promise())
  }
  await Promise.all(promises)

})()
