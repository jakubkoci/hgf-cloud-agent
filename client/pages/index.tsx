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
import { cloudAgentUrl } from '../constants'
import { fromBase64Url, get, sortByDate, toBase64Url } from '../utils'

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
  outOfBandInvitation: Record<string, unknown>
}

const Connections: NextPage = () => {
  const invitationsQuery = useQuery(
    ['invitations'],
    async () => {
      const oobs = await get(`${cloudAgentUrl}/oobs`)
      return oobs.sort(sortByDate)
    },
    {
      placeholderData: [],
      refetchInterval: 2000,
    }
  )
  const connectionsQuery = useQuery(
    ['connections'],
    async () => {
      const connections = await get(`${cloudAgentUrl}/connections`)
      return connections.sort(sortByDate)
    },
    {
      placeholderData: [],
      refetchInterval: 2000,
    }
  )

  const [invitationUrl, setInvitationUrl] = useState('')

  const getInvitation = async () => {
    const response = await fetch(`${cloudAgentUrl}/invitation`)
    const invitationUrl = await response.text()
    openModal(invitationUrl)
  }

  const openModal = (invitationUrl: string) => {
    setInvitationUrl(invitationUrl)
  }

  const closeModal = () => {
    setInvitationUrl('')
  }

  return (
    <>
      <Container>
        <InvitationModal
          visible={!!invitationUrl}
          invitationUrl={invitationUrl}
          onClose={closeModal}
        />
        <Row justify="space-between" align="center">
          <Text h1>Invitations</Text>
          <Button onClick={getInvitation}>Create Invitation</Button>
        </Row>
        <Spacer y={1} />

        <Table
          lined
          headerLined
          shadow={true}
          css={{
            height: 'auto',
            minWidth: '100%',
          }}
        >
          <Table.Header>
            <Table.Column>ID</Table.Column>
            <Table.Column>Date</Table.Column>
            <Table.Column>Status</Table.Column>
            <Table.Column>&nbsp;</Table.Column>
          </Table.Header>
          <Table.Body>
            {invitationsQuery.data.map((invitation: InvitationModel) => {
              const invitationUrl = `${cloudAgentUrl}?oob=${toBase64Url(
                invitation.outOfBandInvitation
              )}`

              return (
                <Table.Row key={invitation.id}>
                  <Table.Cell>{invitation.id}</Table.Cell>
                  <Table.Cell>{invitation.createdAt}</Table.Cell>
                  <Table.Cell>{invitation.state}</Table.Cell>
                  <Table.Cell
                    css={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <Link href={`#`}>
                      <Button onClick={() => openModal(invitationUrl)}>
                        Show Invitation
                      </Button>
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

function InvitationModal({
  visible,
  invitationUrl,
  onClose,
}: {
  visible: boolean
  invitationUrl: string
  onOpen?: () => void
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
          Out-of-band Invitation
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Text h3 id="modal-title">
          QR Code
        </Text>
        <Row justify="center">
          {invitationUrl && <QRCodeSVG size={300} value={invitationUrl} />}
        </Row>
        <Text h3 id="modal-title">
          URL
        </Text>
        <Row>
          <Text css={{ wordBreak: 'break-all' }}>{invitationUrl}</Text>
        </Row>
        <Text h3 id="modal-title">
          JSON
        </Text>
        <Row>
          <Text css={{ wordBreak: 'break-all' }}>
            {JSON.stringify(fromBase64Url(invitationUrl), null, 2)}
          </Text>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color="error" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default Connections
