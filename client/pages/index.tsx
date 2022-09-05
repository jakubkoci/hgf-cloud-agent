import { useState } from 'react'
import type { NextPage } from 'next'
import {
  Button,
  Container,
  Link,
  Modal,
  Row,
  Spacer,
  Table,
  Text,
} from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { QRCodeSVG } from 'qrcode.react'

const cloudAgentUrl = process.env.CLOUD_AGENT_API_URL ?? 'http://localhost:3001'

interface ConnectionModel {
  id: string
  createdAt: string
  did: string
  theirDid: string
  state: string
}

interface InvitationModel {
  id: string
  createdAt: string
  state: string
}

const fetchInvitations = async () => {
  const response = await fetch(`${cloudAgentUrl}/oobs`)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

const fetchConnections = async () => {
  const response = await fetch(`${cloudAgentUrl}/connections`)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

const invitationJson = {
  '@type': 'https://didcomm.org/out-of-band/1.1/invitation',
  '@id': 'b37f3e29-7edc-49e5-a54e-35dfa36e304e',
  label: 'HgfCloudAgent',
  accept: ['didcomm/aip1', 'didcomm/aip2;env=rfc19'],
  handshake_protocols: [
    'https://didcomm.org/didexchange/1.0',
    'https://didcomm.org/connections/1.0',
  ],
  services: [
    {
      id: '#inline-0',
      serviceEndpoint: 'http://localhost:3001',
      type: 'did-communication',
      recipientKeys: [
        'did:key:z6Mkiriy7saK7fvquBqguStSsUWTBYVEUYUiLymNDD52ZJa5',
      ],
      routingKeys: [],
    },
  ],
}

const Connections: NextPage = () => {
  const connectionsQuery = useQuery(['connections'], fetchConnections, {
    placeholderData: [],
    refetchInterval: 2000,
  })
  const invitationsQuery = useQuery(['invitations'], fetchInvitations, {
    placeholderData: [],
    refetchInterval: 2000,
  })
  const [invitationUrl, setInvitationUrl] = useState('')

  const [visible, setVisible] = useState(false)
  const handler = async () => {
    const response = await fetch(`${cloudAgentUrl}/invitation`)
    const invitationUrl = await response.text()
    setInvitationUrl(invitationUrl)
    setVisible(true)
  }

  const closeHandler = () => {
    setVisible(false)
    console.log('closed')
  }

  return (
    <>
      <Container>
        <Row justify="space-between" align="center">
          <Text h1>Invitations</Text>
          <Button onClick={handler}>Add Connection</Button>
          <Modal
            width="650px"
            closeButton
            scroll
            preventClose
            aria-labelledby="modal-title"
            open={visible}
            onClose={closeHandler}
          >
            <Modal.Header>
              <Text id="modal-title" size={18}>
                New Out-of-band Invitation
              </Text>
            </Modal.Header>
            <Modal.Body>
              <Text css={{ wordBreak: 'break-all' }}>{invitationUrl}</Text>
              <Text css={{ wordBreak: 'break-all' }}>
                {JSON.stringify(invitationJson, null, 2)}
              </Text>
              <QRCodeSVG size={300} value={invitationUrl} />
            </Modal.Body>
            <Modal.Footer>
              <Button auto flat color="error" onClick={closeHandler}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Row>
        <Spacer y={1} />

        <Table
          lined
          headerLined
          shadow={true}
          aria-label="Example static collection table"
          css={{
            height: 'auto',
            minWidth: '100%',
          }}
        >
          <Table.Header>
            <Table.Column>Date</Table.Column>
            <Table.Column>Status</Table.Column>
            <Table.Column>&nbsp;</Table.Column>
          </Table.Header>
          <Table.Body>
            {invitationsQuery.data.map((invitation: InvitationModel) => {
              return (
                <Table.Row key={invitation.id}>
                  <Table.Cell>{invitation.createdAt}</Table.Cell>
                  <Table.Cell>{invitation.state}</Table.Cell>
                  <Table.Cell
                    css={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <Link href={`#`}>
                      <Button>Show Invitation</Button>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
        <Spacer y={1} />

        <Row justify="space-between" align="center">
          <Text h1>Connections</Text>
        </Row>
        <Table
          lined
          headerLined
          shadow={true}
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
            <Table.Column>&nbsp;</Table.Column>
          </Table.Header>
          <Table.Body>
            {connectionsQuery.data.map((connection: ConnectionModel) => {
              return (
                <Table.Row key={connection.id}>
                  <Table.Cell>{connection.createdAt}</Table.Cell>
                  <Table.Cell>
                    <Text>{connection.did}</Text>
                    <Text>{connection.theirDid}</Text>
                  </Table.Cell>
                  <Table.Cell>{connection.state}</Table.Cell>
                  <Table.Cell
                    css={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
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
