"use client";
import React, { useEffect, useState } from "react";
import {
  Mention,
  MentionsInput,
  OnChangeHandlerFunc,
  SuggestionDataItem,
} from "react-mentions";

type RecipientInputProps = {
  recipient: SuggestionDataItem | undefined;
  defaultRecipient?: User;
  setRecipient: React.Dispatch<
    React.SetStateAction<SuggestionDataItem | undefined>
  >;
  friends: SuggestionDataItem[];
};

export default function RecipientInput({
  defaultRecipient,
  recipient,
  setRecipient,
  friends,
}: RecipientInputProps) {
  const [selected, setSelected] = useState<string | undefined>(
    recipient?.display
  );

  useEffect(() => {
    if (defaultRecipient && defaultRecipient.name) {
      setSelected(defaultRecipient.name);
    }
  }, [defaultRecipient]);

  const handleOnChange: OnChangeHandlerFunc = (
    _ev,
    newValue,
    newValueAsString
  ) => {
    setSelected(newValue);

    const newRecipient = friends.find(
      (f) => f.display === newValueAsString.trim()
    );
    setRecipient(newRecipient);
  };
  return (
    <div className="w-full flex items-center gap-2 px-2 border rounded-md p-1 bg-accent">
      <p className="text-sm text-muted-foreground">Recipient: </p>
      <MentionsInput
        singleLine
        className="w-full"
        placeholder="@example"
        value={selected}
        onChange={handleOnChange}
      >
        <Mention
          trigger="@"
          data={friends}
          appendSpaceOnAdd
          className="bg-indigo-200/50"
        />
      </MentionsInput>
    </div>
  );
}
