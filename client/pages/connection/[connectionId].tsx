import {
  Button,
  Card,
  Container,
  Link,
  Row,
  Spacer,
  Table,
  Text,
} from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { cloudAgentUrl } from '../../constants'
import { get } from '../../utils'

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
}

const ConnectionDetail: NextPage = () => {
  const [connection, setConnection] = useState({ id: '' })
  const [isLoading, setLoading] = useState(false)
  const router = useRouter()
  const { connectionId } = router.query
  console.log(router, connectionId)

  useEffect(() => {
    setLoading(true)
    fetch('http://localhost:3001/connections')
      .then((res) => res.json())
      .then((connections) => {
        console.log(connections)
        const connection = connections.find((connection: ConnectionModel) => {
          console.log('connection', connection)
          return connection.id === connectionId
        })
        if (connection) {
          setConnection(connection)
        }
        setLoading(false)
      })
  }, [connectionId])

  return (
    <>
      <Container>
        <Row justify="space-between" align="center">
          <Text h1>Connection Detail</Text>
        </Row>
        <Spacer y={1} />

        <Card>
          <Card.Body>Details {connection.id}</Card.Body>
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
      )
    },
    {
      placeholderData: [],
      refetchInterval: 2000,
    }
  )

  return (
    <>
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
                    <Button>Detail</Button>
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
        (proof: CredentialModel) => proof.connectionId === connectionId
      )
    },
    {
      placeholderData: [],
      refetchInterval: 2000,
    }
  )

  return (
    <>
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
          {proofsQuery.data.map((proof: CredentialModel) => {
            return (
              <Table.Row key="1">
                <Table.Cell>{proof.id}</Table.Cell>
                <Table.Cell>{proof.createdAt}</Table.Cell>
                <Table.Cell>{proof.state}</Table.Cell>
                <Table.Cell>
                  <Link href="#">
                    <Button>Detail</Button>
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

export default ConnectionDetail
