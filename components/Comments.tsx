import React, { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import Link from "next/link";
import { GoVerified } from "react-icons/go";

import useAuthStore from "../store/authStore";
import NoResults from "./NoResults";
import { IUser } from "../types";
import { NextPage } from "next";

interface Props {
	isPostingComment: Boolean;
	comment: string;
	setComment: Dispatch<SetStateAction<string>>;
	addComment: (e: React.FormEvent) => void;
	comments: IComment[];
}

interface IComment {
	comment: string;
	length?: number;
	_key: string;
	postedBy: { _ref?: string; _id?: string };
}

const Comments: NextPage<Props> = ({
	comment,
	setComment,
	addComment,
	comments,
	isPostingComment,
}) => {
	const { allUsers, userProfile }: any = useAuthStore();

	return (
		<div className="border-t-2 border-gray-200 pt-4 px-10 mt-4 bg-[#F8F8F8] border-b-2 lg:pb-0 pb-[100px]">
			<div className="overflow-scroll lg:h-[457px]">
				{comments?.length > 0 ? (
					comments?.map((item: IComment, idx: number) => (
						<>
							{allUsers?.map(
								(user: IUser) =>
									user._id === (item.postedBy._ref || item.postedBy._id) && (
										<div className="items-center p-2 " key={idx}>
											<Link href={`/profile/${user._id}`}>
												<div className="flex items-start gap-3">
													<div className="w-8 h-8">
														<Image
															width={34}
															height={34}
															className="rounded-full"
															src={user.image}
															alt="user profile"
															layout="responsive"
														/>
													</div>
													<div className="xl:block">
														<p className="flex items-center gap-1 font-bold lowercase text-md text-primary">
															{user.userName.replaceAll(" ", "")}
															<GoVerified className="text-blue-400" />
														</p>
														<p className="text-xs text-gray-400 capitalize">
															{user.userName}
														</p>
													</div>
												</div>
											</Link>
											<div>
												<p>{item.comment}</p>
											</div>
										</div>
									)
							)}
						</>
					))
				) : (
					<NoResults text="No Comments Yet! Be First to do add the comment." />
				)}
			</div>
			{userProfile && (
				<div className="absolute bottom-0 left-0 px-2 pb-6 md:px-10 ">
					<form onSubmit={addComment} className="flex gap-4">
						<input
							value={comment}
							onChange={(e) => setComment(e.target.value.trim())}
							className="bg-primary px-6 py-4 text-md font-medium border-2 w-[250px] md:w-[700px] lg:w-[350px] border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 flex-1 rounded-lg"
							placeholder="Add comment.."
						/>
						<button className="text-gray-400 text-md " onClick={addComment}>
							{isPostingComment ? "Commenting..." : "Comment"}
						</button>
					</form>
				</div>
			)}
		</div>
	);
};

export default Comments;
