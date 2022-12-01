import {
  Button,
  Container,
  Modal,
  Row,
  Spacer,
  Text,
  Textarea,
  useInput,
} from '@nextui-org/react'
import { NextPage } from 'next'
import { useState } from 'react'
import { cloudAgentUrl } from '../../constants'
import { post } from '../../utils'

const HolderScreen: NextPage = () => {
  const [visible, setVisible] = useState(false)

  const openModal = () => {
    setVisible(true)
  }

  const closeModal = () => {
    setVisible(false)
  }
  return (
    <Container>
      <AcceptInvitationModal visible={!!visible} onClose={closeModal} />
      <Row justify="space-between" align="center">
        <Text h1>Invitations</Text>
        <Button onClick={() => openModal()}>Accept Invitation</Button>
      </Row>
      <Spacer y={1} />
    </Container>
  )
}

function AcceptInvitationModal({
  visible,
  onClose,
}: {
  visible: boolean
  onClose: () => void
}) {
  const { value, setValue, reset, bindings } = useInput('')

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
          Invitation URL
        </Text>
        <Textarea
          placeholder="Insert an invitation URL here..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          auto
          flat
          color="primary"
          onClick={async () => {
            await post(`${cloudAgentUrl}/accept-invitation`, {
              invitationUrl: value,
            })
            setValue('')
            onClose()
          }}
        >
          Accept
        </Button>
        <Button
          auto
          flat
          onClick={() => {
            setValue('')
            onClose()
          }}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default HolderScreen
