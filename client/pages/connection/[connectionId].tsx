import {
  Button,
  Card,
  Container,
  Link,
  Modal,
  Row,
  Spacer,
  Table,
  Text,
  Grid,
} from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { cloudAgentUrl } from '../../constants'
import { get, sortByDate } from '../../utils'
import { ReactElement, useState } from 'react'

interface ConnectionModel {
  id: string
  createdAt: string
  did: string
  theirDid: string
  state: string
}

interface CredentialModel {
  id: string
  createdAt: string
  state: string
  connectionId: string
  credentialAttributes: any
}

interface ProofRequestModel extends CredentialModel {
  presentationMessage: any
}

interface DetailsItemModel {
  name: string
  value: string
}

const ConnectionDetail: NextPage = () => {
  const router = useRouter()
  const { connectionId } = router.query

  const connectionQuery = useQuery(
    ['connections', connectionId],
    async () => {
      const connections = await get(`${cloudAgentUrl}/connections`)
      const connection = connections.find(
        (connection: ConnectionModel) => connection.id === connectionId
      )
      if (connection) {
        return connection
      }

      return {}
    },
    { placeholderData: { id: '' } }
  )

  const connection = connectionQuery.data

  return (
    <>
      <Container>
        <Row justify="space-between" align="center">
          <Text h1>Connection Details</Text>
        </Row>
        <Spacer y={1} />

        <Card>
          <Card.Body>
          <Grid.Container css={{ pl: '$6' }}>
            <Grid sm={12} md={6}>
              <Text><strong>Connection ID:</strong> {connection.id}</Text>
            </Grid>
            <Grid sm={12} md={6}>
              <Text><strong>Date:</strong> {connection.createdAt}</Text>
            </Grid>
            <Grid sm={12} md={6}>
              <Text><strong>State:</strong> {connection.state}</Text>
            </Grid>
            <Grid sm={12} md={6}>
              <Text><strong>Role:</strong> {connection.role}</Text>
            </Grid>
            <Grid sm={12} md={6}>
              <Text><strong>Out Of Band ID:</strong> {connection.outOfBandId}</Text>
            </Grid>
            <Grid sm={12} md={6}>
              <Text><strong>Auto Accept Connection:</strong> {connection.autoAcceptConnection ? 'true' : 'false'}</Text>
            </Grid>
            <Grid sm={12} md={6}>
              <Text><strong>Our DID:</strong> {connection.did}</Text>
            </Grid>
            <Grid sm={12} md={6}>
              <Text><strong>Their DID:</strong> {connection.theirDid}</Text>
            </Grid>
          </Grid.Container>
          </Card.Body>
        </Card>
        <Spacer y={1} />

        <CredentialList connectionId={connection.id} />
        <Spacer y={1} />

        <ProofList connectionId={connection.id} />
      </Container>
    </>
  )
}

function CredentialList({ connectionId }: { connectionId: string }) {
  const credentialsQuery = useQuery(
    ['credentials'],
    async () => {
      const credentials = await get(`${cloudAgentUrl}/credentials`)
      return credentials.filter(
        (credential: CredentialModel) =>
          credential.connectionId === connectionId
      ).sort(sortByDate)
    },
    {
      placeholderData: [],
      refetchInterval: 2000,
    }
  )
  const [details, setDetails] = useState<CredentialModel | null>(null)

  const closeModal = (): void => {
    setDetails(null)
  }

  return (
    <>
      <DetailsModal
        visible={!!details}
        title="Credential Details"
        onClose={closeModal}
      >
        {/* @ts-ignore */}
        {details && <CredentialDetailsChunk details={details} />}
      </DetailsModal>
      <Row justify="space-between" align="center">
        <Text h2>Credentials</Text>
        <Button
          onPress={() =>
            get(`${cloudAgentUrl}/issue-credential/${connectionId}`)
          }
        >
          Issue Credential
        </Button>
      </Row>
      <Table
        lined
        headerLined
        css={{
          height: 'auto',
          minWidth: '100%',
        }}
      >
        <Table.Header>
          <Table.Column>ID</Table.Column>
          <Table.Column>Date</Table.Column>
          <Table.Column>State</Table.Column>
          <Table.Column>Actions</Table.Column>
        </Table.Header>
        <Table.Body>
          {credentialsQuery.data.map((credential: CredentialModel) => {
            return (
              <Table.Row key={credential.id}>
                <Table.Cell>{credential.id}</Table.Cell>
                <Table.Cell>{credential.createdAt}</Table.Cell>
                <Table.Cell>{credential.state}</Table.Cell>
                <Table.Cell>
                  <Link href="#">
                    <Button onPress={() => setDetails(credential)}>
                      Detail
                    </Button>
                  </Link>
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </>
  )
}

function ProofList({ connectionId }: { connectionId: string }) {
  const proofsQuery = useQuery(
    ['proofs'],
    async () => {
      const proofs = await get(`${cloudAgentUrl}/proofs`)
      return proofs.filter(
        (proof: ProofRequestModel) => proof.connectionId === connectionId
      ).sort(sortByDate)
    },
    {
      placeholderData: [],
      refetchInterval: 2000,
    }
  )
  const [details, setDetails] = useState<ProofRequestModel | null>(null)

  const closeModal = (): void => {
    setDetails(null)
  }

  return (
    <>
      <DetailsModal
        visible={!!details}
        title="Proof Request Details"
        onClose={closeModal}
      >
        {/* @ts-ignore */}
        {details && <ProofRequestDetailsChunk details={details} />}
      </DetailsModal>
      <Row justify="space-between" align="center">
        <Text h2>Proofs</Text>
        <Button
          onPress={() => get(`${cloudAgentUrl}/request-proof/${connectionId}`)}
        >
          Request Proof
        </Button>
      </Row>
      <Table
        lined
        headerLined
        css={{
          height: 'auto',
          minWidth: '100%',
        }}
      >
        <Table.Header>
          <Table.Column>ID</Table.Column>
          <Table.Column>Date</Table.Column>
          <Table.Column>State</Table.Column>
          <Table.Column>Actions</Table.Column>
        </Table.Header>
        <Table.Body>
          {proofsQuery.data.map((proof: ProofRequestModel) => {
            return (
              <Table.Row key={proof.id}>
                <Table.Cell>{proof.id}</Table.Cell>
                <Table.Cell>{proof.createdAt}</Table.Cell>
                <Table.Cell>{proof.state}</Table.Cell>
                <Table.Cell>
                  <Link href="#">
                    <Button onPress={() => setDetails(proof)}>Detail</Button>
                  </Link>
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </>
  )
}

function DetailsModal({
  children,
  visible,
  title,
  onClose,
}: {
  children: ReactElement
  visible: boolean
  title: string
  onClose: () => void
}) {
  return (
    <Modal
      width="650px"
      closeButton
      scroll
      preventClose
      aria-labelledby="modal-title"
      open={visible}
      onClose={onClose}
    >
      <Modal.Header>
        <Text h2 id="modal-title">
          {title}
        </Text>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button auto flat color="error" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

function CredentialDetailsChunk({ details }: { details: CredentialModel }) {
  return <TitledDetails data={details.credentialAttributes} />
}

function ProofRequestDetailsChunk({ details }: { details: ProofRequestModel }) {
  const [presentationMessage] = useState(
    JSON.parse(
      new Buffer(
        details.presentationMessage['presentations~attach'][0].data.base64,
        'base64'
      ).toString('ascii')
    )
  )
  const [revealedAttrs] = useState<any>(
    presentationMessage.requested_proof.revealed_attrs
  )
  const [revealedAttrsDataMap] = useState<DetailsItemModel[]>(
    getProofAttrs(revealedAttrs)
  )
  const [predicates] = useState<any>(
    presentationMessage.requested_proof.predicates
  )
  const [predicatesDataMap] = useState<DetailsItemModel[]>(
    getProofAttrs(predicates)
  )

  function getProofAttrs(data: any): DetailsItemModel[] {
    let tempRevealedAttrs = []

    for (let proofName in data) {
      tempRevealedAttrs.push({
        name: proofName,
        value: data[proofName].raw,
      })
    }

    return tempRevealedAttrs
  }

  return (
    <>
      <Grid.Container>
        <TitledDetails
          data={revealedAttrsDataMap}
          title="Revealed Attributes"
        />
        <TitledDetails data={predicatesDataMap} title="Predicates" />
      </Grid.Container>
    </>
  )
}

function TitledDetails({
  data,
  title,
}: {
  data: DetailsItemModel[]
  title?: string
}) {
  return (
    <>
      {data.length && title && (
        <Grid xs={12} css={{ alignItems: 'center', margin: '15px 0' }}>
          <Text h4>{title}</Text>
        </Grid>
      )}
      {data.length &&
        data.map((proof: DetailsItemModel, index: number) => {
          return (
            <Grid.Container
              key={index}
              css={{
                width: '100%',
                pl: '$6',
                background: index % 2 == 0 ? '#f9f9f9' : '#fff',
                height: '$15',
              }}
            >
              <Grid xs={6} css={{ alignItems: 'center' }}>
                <Text>{proof.name}</Text>
              </Grid>
              <Grid xs={6} css={{ alignItems: 'center' }}>
                <Text>{proof.value}</Text>
              </Grid>
            </Grid.Container>
          )
        })}
    </>
  )
}

export default ConnectionDetail
