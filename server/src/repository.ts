import fs from 'fs'
import schemas from '../schemas.json'

let schemaId = schemas.schemaId
let credentialDefinitionId = schemas.credentialDefinitionId

export function saveSchemaId(newSchemaId: string) {
  schemaId = newSchemaId
  const updatedSchemas = { ...schemas, schemaId }
  fs.writeFileSync('schemas.json', JSON.stringify(updatedSchemas, null, 2))
}

export function saveCredentialDefinitionId(newCredentialDefinitionId: string) {
  credentialDefinitionId = newCredentialDefinitionId
  const updatedSchemas = { ...schemas, credentialDefinitionId }
  fs.writeFileSync('schemas.json', JSON.stringify(updatedSchemas, null, 2))
}

export function getSchemaId() {
  return schemaId
}

export function getCredentialDefinitionId() {
  return credentialDefinitionId
}
