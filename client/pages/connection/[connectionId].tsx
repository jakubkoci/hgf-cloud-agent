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
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface ConnectionModel {
  id: string
  createdAt: string
  did: string
  theirDid: string
  state: string
}

const ConnectionDetail: NextPage = () => {
  const [connection, setConnection] = useState({ id: '' })
  const [credentials, setCredentials] = useState([])
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
          console.log('connectionId', connectionId)
          console.log(
            'connection.id === connectionId',
            connection.id === connectionId
          )
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

        <Row justify="space-between" align="center">
          <Text h2>Credentials</Text>
          <Button>Issue Credential</Button>
        </Row>
        <Table
          lined
          headerLined
          aria-label="Example static collection table"
          css={{
            height: 'auto',
            minWidth: '100%',
          }}
        >
          <Table.Header>
            <Table.Column>Date</Table.Column>
            <Table.Column>DID</Table.Column>
            <Table.Column>Status</Table.Column>
            <Table.Column>Actions</Table.Column>
          </Table.Header>
          <Table.Body>
            {credentials.map((connection: ConnectionModel) => {
              return (
                <Table.Row key="1">
                  <Table.Cell>{connection.createdAt}</Table.Cell>
                  <Table.Cell>
                    <Text>{connection.did}</Text>
                    <Text>{connection.theirDid}</Text>
                  </Table.Cell>
                  <Table.Cell>{connection.state}</Table.Cell>
                  <Table.Cell>
                    <Link href={`/connection/${connection.id}`}>
                      <Button>Detail</Button>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      </Container>
    </>
  )
}

export default ConnectionDetail
