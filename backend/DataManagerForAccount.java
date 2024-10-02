import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Scanner;



/**
 * Manages a list of {@code Account} objects ensuring that only one instance of this manager exists in the application using the Singleton design pattern.
 * If serialization data is not available, it initializes the account list from a CSV file.
 */
public class DataManagerForAccount implements IDataManagerWithCount{
	private ArrayList<Account> accountList;
	private static DataManagerForAccount instance;
	private final Serializer<Account> serializer;

	/**
     * Private constructor to prevent instantiation outside of this class.
     * Initializes the account list either by deserializing from a file or by loading from a CSV file
     * when the serialized data is not available.
     */
	private DataManagerForAccount() {
		serializer = new Serializer<Account>("data/accountData.ser");
		loadData();
	}

	/**
     * Provides access to the singleton instance of the {@code DataManagerForAccount}.
     * If the instance does not exist, it is created using the private constructor. This method ensures
     * that only one instance of DataManagerForAccount is active at any time, conforming to the Singleton design pattern.
     *
     * @return The singleton instance of {@code DataManagerForAccount}.
     */
	public static DataManagerForAccount getInstance() {
		if (instance == null) {
			instance = new DataManagerForAccount();
		}
		return instance;
	}

	/**
     * Loads account data from a serialized file. If the file is not found or cannot be read,
     * it initializes the account list from a CSV file and logs this action.
     */
	private void loadData(){
		try{
			accountList = serializer.deserialize();
		}catch (IOException | ClassNotFoundException e){
			accountList = new ArrayList<Account>();
			initializeFromCSV();
		}
	}

	/**
     * Initializes account data from a CSV file. This method reads account details from a CSV,
     * creates account objects, and adds them to the list.
     */
	private void initializeFromCSV() {
		DataManagerForFoodItem foodItemDB = DataManagerForFoodItem.getInstance();
		DisplayFilteredByBranch staffDisplay = new DisplayFilteredByBranch();
	
		File f = new File("data/staff_list.csv");
		try{
			Scanner sc = new Scanner(f);
            sc.nextLine();
			while (sc.hasNextLine()) {
				String line = sc.nextLine();
				String[] data = line.split(",");
				String role = data[2];
				switch (role){
					case "A":
						accountList.add(new Admin(data[0], data[1], data[2], data[3], Integer.parseInt(data[4])));
                        break;
					case "M":
						accountList.add(new Manager(data[0], data[1], data[2], data[3],Integer.parseInt(data[4]), data[5],staffDisplay, foodItemDB, this));
                        break;
					case "S":
						accountList.add(new Staff(data[0], data[1], data[2], data[3],Integer.parseInt(data[4]), data[5],staffDisplay));
                        break;
                    default:
                        break;
				}
			}
			serializer.serialize(accountList);
			System.out.println("Account CSV data initialised.");
			sc.close();
		}catch (FileNotFoundException e){
			System.out.println("Error: Account CSV File not found");
		}
       
    }

	/**
     * Serializes the current list of accounts to a file for persistence.
     */
    public void saveData(){
        serializer.serialize(accountList);
    }


	/**
     * Updates a specific account in the list.
     * This method locates the account in the list using its staff ID and replaces it with the provided updated account.
     * After updating the account, the list is persisted.
     *
     * @param newAccount The updated account to replace the existing one.
     */
	public void update(Account newAccount) {
		String staffID = newAccount.getStaffID();
		for (int i = 0; i < accountList.size(); i++) {
			if (accountList.get(i).getStaffID().equals(staffID)){
				accountList.set(i, newAccount);
                serializer.serialize(accountList);
				System.out.println("Successfully updated account.");
				break;
			}
		}
	}

	/**
     * Adds a new account to the list.
     * This method appends the specified account to the account list and immediately persists the updated list.
     * 
     * @param newAccount The account to be added to the list.
     */
	public void add(Account newAccount) {
		accountList.add(newAccount);
        System.out.println("Successfully added account.");
		serializer.serialize(accountList);
	}

	/**
     * Deletes a specific account from the list.
     * If the account exists in the list, it is removed and the list is persisted.
     * A message is printed to indicate whether the removal was successful or not.
     *
     * @param account The account to be deleted from the list.
     */
	public void delete(Account account) {
		if (accountList.remove(account)){
            System.out.println("Successfully removed account.");
		    serializer.serialize(accountList);
        }else{
            System.out.println("Failed to remove account.");
        }
	}

	/**
     * Finds an account based on its staff ID.
     * This method searches through the account list and returns the first account that matches the provided staff ID.
     *
     * @param staffID The staff ID of the account to find.
     * @return The account with the matching staff ID, or {@code null} if no matching account is found.
     */
	public Account find(String staffID) {
		for (Account currAcc: accountList) {
			if (currAcc.getStaffID().equals(staffID))
				return currAcc;
		}
		return null;
	}

	/**
     * Retrieves the complete list of accounts.
     * This method returns an ArrayList containing all accounts managed by this DataManager.
     *
     * @return An ArrayList of {@code Account} objects.
     */
	public ArrayList<Account> getAll() {
		return accountList;
	}

	/**
     * Counts the number of staff in a specific branch.
     * This method iterates through the list of accounts and counts how many staff members belong to the specified branch.
     *
     * @param branchName The name of the branch to count staff members in.
     * @return The count of staff members in the specified branch.
     */
	public int countStaffInBranch(String branchName) {
		int staffCount = 0;
		for (Account currAcc: accountList) {
			if (currAcc.getRole().equals("S")){
				if (currAcc instanceof Staff){
					Staff staffAcc = (Staff) currAcc;
					if (staffAcc.getBranchName().equals(branchName)) 
						staffCount++;
				}
			}
		}
		return staffCount;
	}

	/**
     * Counts the number of managers in a specific branch.
     * This method iterates through the list of accounts and counts how many managers belong to the specified branch.
     *
     * @param branchName The name of the branch to count managers in.
     * @return The count of managers in the specified branch.
     */
	public int countManagerInBranch(String branchName) {
		int managerCount = 0;
		for (Account currAcc: accountList) {
			if (currAcc.getRole().equals("M")){
				if (currAcc instanceof Manager){
					Manager managerAcc = (Manager) currAcc;
					if (managerAcc.getBranchName().equals(branchName)) 
						managerCount++;
				}
			}
		}
		return managerCount;
	}

}