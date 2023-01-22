import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { GoVerified } from "react-icons/go";
import useAuthStore from "../store/authStore";
import { IUser } from "../types";

const SuggestedAccounts = () => {
	const { fetchAllUsers, allUsers } = useAuthStore();

	useEffect(() => {
		fetchAllUsers();
	}, [fetchAllUsers]);

	return (
		<div className="pb-4 border-gray-200 xl:border-b-2">
			<p className="hidden m-3 mt-4 font-semibold text-gray-500 xl:block">
				Suggested accounts
			</p>
			<div>
				{allUsers?.slice(0, 6).map((user: IUser) => (
					<Link href={`/profile/${user._id}`} key={user._id}>
						<div className="flex gap-3 p-2 font-semibold rounded cursor-pointer hover:bg-primary">
							<div className="w-8 h-8">
								<Image
									width={34}
									height={34}
									className="rounded-full"
									src={user.image}
									alt="user-profile"
									layout="responsive"
								/>
							</div>

							<div className="hidden xl:block">
								<p className="flex items-center gap-1 font-bold lowercase text-md text-primary">
									{user.userName.replace(/\s+/g, "")}{" "}
									<GoVerified className="text-blue-400" />
								</p>
								<p className="text-xs text-gray-400 capitalize">
									{user.userName}
								</p>
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default SuggestedAccounts;
