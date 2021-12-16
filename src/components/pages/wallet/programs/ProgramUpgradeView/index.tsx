import { useAccountData, usePubkey } from "@saberhq/sail";
import { FaUpload } from "react-icons/fa";
import { useParams } from "react-router";

import { useAuthorityBuffers } from "../../../../../hooks/useAuthorityPrograms";
import { useSmartWallet } from "../../../../../hooks/useSmartWallet";
import { BPF_UPGRADEABLE_LOADER_ID } from "../../../../../utils/instructions/upgradeable_loader/instructions";
import { displayAddress } from "../../../../../utils/programs";
import { ErrorMessage } from "../../../../common/ErrorMessage";
import { LoadingPage } from "../../../../common/LoadingPage";
import { Notice } from "../../../../common/Notice";
import { BasicPage } from "../../../../common/page/BasicPage";
import { BasicSection } from "../../../../common/page/Section";
import { BufferCard } from "./BufferCard";

export const ProgramUpgradeView: React.FC = () => {
  const { key } = useSmartWallet();
  const buffers = useAuthorityBuffers(key);
  const { programID: programIDStr } = useParams<{ programID: string }>();
  const programID = usePubkey(programIDStr);
  const { data: program } = useAccountData(programID);

  const isProgram = program
    ? program?.accountInfo.owner.equals(BPF_UPGRADEABLE_LOADER_ID)
    : program;

  return (
    <BasicPage
      title={`Upgrade Program ${
        programID ? displayAddress(programID.toString()) : "--"
      }`}
      description={`Upgrade a program's code`}
    >
      <Notice tw="mb-8" icon={<FaUpload />} title="How do I upgrade a program?">
        <ol>
          <li>
            Build your program, ideally using{" "}
            <code>anchor build --verifiable</code>.
          </li>
          <li>
            Upload your program's buffer via
            <br />
            <code>solana program write-buffer &lt;PROGRAM_FILEPATH&gt;</code>.
            <br />
            This will give you a buffer key. Keep track of this!
          </li>
          <li>
            Change the program's upgrade authority to this smart wallet via
            <br />
            <code>
              solana program set-buffer-authority &lt;BUFFER_KEY&gt;
              --new-buffer-authority {key.toString()}
            </code>
            .
          </li>
          <li>
            Use the tool below to select the buffer to upgrade, and propose the
            transaction.
          </li>
        </ol>
      </Notice>
      <BasicSection title="Available Buffers">
        {(buffers.isLoading || program === undefined) && <LoadingPage />}
        {buffers.isError && <ErrorMessage error={buffers.error} />}
        {isProgram && programID && (
          <div>
            {buffers.data?.length === 0 && (
              <Notice>
                <p>There are no buffers owned by this smart wallet.</p>
                <p>
                  Follow the instructions above to upload the bytecode for a new
                  program upgrade.
                </p>
              </Notice>
            )}
            <div tw="grid gap-2">
              {buffers.data?.map((buffer) => (
                <BufferCard
                  key={buffer.pubkey.toString()}
                  buffer={buffer}
                  programID={programID}
                />
              ))}
            </div>
          </div>
        )}
      </BasicSection>
    </BasicPage>
  );
};
