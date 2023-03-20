// wallet addressが登録されていないときに表示されるモーダル

import { useMigrateWeb3 } from "@/hooks/useMigrateWeb3"
import { useLocale } from "@/i18n/useLocale"
import { Modal, Image, Center, Text } from "@mantine/core"
import { useEffect, useState } from "react"
import { ConnectWallet } from "../web3/login/ConnectWallet"

export const WalletAddressRegisterModal = () => {
  const { t } = useLocale()
  const [opened, setOpened] = useState(false)
  const { registerWalletAddress, isRegisterWallet } = useMigrateWeb3()

  useEffect(() => {
    isRegisterWallet().then((res) => {
      if (res === null) return
      if (!res) {
        setOpened(true)
      }
    })
  }, [])

  const onLogin = async () => {
    await registerWalletAddress()
    setOpened(false)
  }

  return (
    <Modal opened={opened} onClose={() => setOpened(false)} title={t.WalletAddressRegisterModal.Title}>
      <Text mt="xl">{t.WalletAddressRegisterModal.Description}</Text>
      <Center mt="xl">
        <ConnectWallet isMetamaskOnly={true} onLogin={onLogin} />
      </Center>
    </Modal>
  )
}
