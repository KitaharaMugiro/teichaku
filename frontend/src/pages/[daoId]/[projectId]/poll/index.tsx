import { PollSystem } from "@/components/poll/PollSystem";
import { useDaoExistCheck } from "@/hooks/dao/useDaoExistCheck";
import usePoll from "@/hooks/dao/usePoll";
import useMetaMask from "@/hooks/web3/useMetaMask";
import { getLeftTime } from "@/utils/calculateLeftTime";
import { Center, Container, Text, Title } from "@mantine/core";
import { useInterval } from "@mantine/hooks";
import { useEffect, useState } from "react";

const Poll = () => {
  useDaoExistCheck()
  const { address } = useMetaMask()
  const { isAdmin, checkIsAdmin, pollDetail, voterReward, contributorReward, vote, candidateToPoll, loadCurrentMaxPoll, settleCurrentPollAndCreateNewPoll } =
    usePoll();
  const [leftTimeStr, setLeftTimeStr] = useState("");

  useEffect(() => {
    loadCurrentMaxPoll();
  }, [])

  useEffect(() => {
    if (address) checkIsAdmin()
  }, [address])


  const interval = useInterval(() => {
    if (endTimeStamp) setLeftTimeStr(getLeftTime(endTimeStamp));
  }, 1000);
  useEffect(() => {
    interval.start();
    return interval.stop;
  }, [pollDetail]);
  if (!pollDetail) return <div>Loading</div>;
  const voters = pollDetail.voters;
  const candidates = pollDetail.contributions;
  const startTimeStamp = pollDetail.startTimeStamp;
  const endTimeStamp = pollDetail.endTimeStamp;

  const _vote = async (points: number[][], comments: string[]) => {
    const candidates = pollDetail.contributions.map((c) => c.contributor);
    console.log({ points, comments, candidates });
    await vote(pollDetail.pollId, candidates, points, comments);
  };

  const _candidateToPoll = async (
    contributionText: string,
    evidences: string[],
    roles: string[]
  ) => {
    await candidateToPoll(contributionText, evidences, roles);
  };

  const _settle = async () => {
    await settleCurrentPollAndCreateNewPoll();
  };

  if (!pollDetail) return <div>Loading</div>;
  return (
    <Container>
      <Center>
        <Title size="h1">Contribution Poll</Title>
      </Center>

      <Text mb="lg">
        This poll end in{"  "}
        <Text
          size="xl"
          span
          variant="gradient"
          gradient={{ from: "blue", to: "grape" }}
        >
          {leftTimeStr}
        </Text>
      </Text>
      <PollSystem
        candidates={candidates}
        alreadyVoted={pollDetail.alreadyVoted}
        contributorReward={contributorReward}
        vote={_vote}
        perspectives={pollDetail.perspectives}
        candidateToPoll={_candidateToPoll}
        isAdmin={isAdmin}
        settle={_settle}
      />
    </Container>
  );
};
export default Poll;