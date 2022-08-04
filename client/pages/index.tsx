import {
  Button,
  Container,
  Link,
  Row,
  Spacer,
  Table,
  Text,
} from '@nextui-org/react'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'

interface ConnectionModel {
  id: string
  createdAt: string
  did: string
  theirDid: string
  state: string
}

const Connections: NextPage = () => {
  const [connections, setConnections] = useState([])
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('http://localhost:3001/connections')
      .then((res) => res.json())
      .then((data) => {
        setConnections(data)
        setLoading(false)
      })
  }, [])

  return (
    <>
      <Container>
        <Row justify="space-between" align="center">
          <Text h1>Connections</Text>
          <Button>Add Connection</Button>
        </Row>
        <Spacer y={1} />
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
            {connections.map((connection: ConnectionModel) => {
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

export default Connections
