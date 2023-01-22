import { NextPage } from "next";
import React from "react";
import { MdOutlineVideocamOff } from "react-icons/md";
import { BiCommentX } from "react-icons/bi";

interface IProps {
	text: string;
}

const NoResults: NextPage<IProps> = ({ text }) => {
	return (
		<div className="flex flex-col items-center justify-center w-full h-full">
			<p className="text-8xl">
				{text === "No comments yet" ? <BiCommentX /> : <MdOutlineVideocamOff />}
			</p>
			<p className="text-2xl text-center">{text}</p>
		</div>
	);
};

export default NoResults;
