import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import Link from "next/link";
import { GoVerified } from "react-icons/go";
import { useRouter } from "next/router";
import { VideoCard, NoResults } from "../../components";
import { IUser, Video } from "../../types";
import { BASE_URL } from "../../utils";
import useAuthStore from "../../store/authStore";
import { NextPage } from "next";

interface Props {
	videos: Video[];
}

const Search: NextPage<Props> = ({ videos }) => {
	const [isAccounts, setIsAccounts] = useState<boolean>(false);
	const { allUsers } = useAuthStore();
	const router = useRouter();
	const { searchTerm }: any = router.query;
	const searchedAccounts = allUsers.filter((user: IUser) =>
		user.userName.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const accountsTab = isAccounts ? "border-b-2 border-black" : "text-gray-400";
	const VideosTab = !isAccounts ? "border-b-2 border-black" : "text-gray-400";

	return (
		<div className="w-full">
			<div className="flex w-full gap-10 mt-10 mb-10 bg-white border-b-2 border-gray-200">
				<p
					className={`text-xl font-semibold cursor-pointer mt-2 ${accountsTab}`}
					onClick={() => setIsAccounts(true)}
				>
					Accounts
				</p>
				<p
					className={`text-xl font-semibold cursor-pointer mt-2 ${VideosTab}`}
					onClick={() => setIsAccounts(false)}
				>
					Videos
				</p>
			</div>
			{isAccounts ? (
				<div className="md:mt-16">
					{searchedAccounts.length > 0 ? (
						searchedAccounts.map((user: IUser, i) => (
							<Link href={`/profile/${user._id}`} key={i}>
								<div className="flex gap-3 p-2 font-semibold border-b-2 border-gray-200 rounded cursor-pointer">
									<div>
										<Image
											width={50}
											height={50}
											className="rounded-full"
											src={user.image}
											alt="user profile"
										/>
									</div>
									<div>
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
						))
					) : (
						<NoResults text={`No video results for ${searchTerm}`} />
					)}
				</div>
			) : (
				<div className="flex flex-wrap gap-6 mt-16 md: md:justify-start">
					{videos?.length ? (
						videos.map((video: Video, i) => <VideoCard post={video} key={i} />)
					) : (
						<NoResults text={`No video results for ${searchTerm}`} />
					)}
				</div>
			)}
		</div>
	);
};

export const getServerSideProps = async ({
	params: { searchTerm },
}: {
	params: { searchTerm: string };
}) => {
	const res = await axios.get(`${BASE_URL}/api/search/${searchTerm}`);

	return {
		props: {
			videos: res.data,
		},
	};
};

export default Search;
