import requests
import sys
import json
import time
from datetime import datetime

class QuantumSpaceAPITester:
    def __init__(self, base_url="https://quantum-ai-research.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_research_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=30):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=timeout)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout after {timeout} seconds")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root endpoint"""
        return self.run_test("Root Endpoint", "GET", "", 200)

    def test_health_check(self):
        """Test health check endpoint"""
        return self.run_test("Health Check", "GET", "health", 200)

    def test_ai_chat(self):
        """Test AI chat functionality"""
        print("\n🤖 Testing AI Chat Integration...")
        
        # Test with a simple space research question
        chat_data = {"message": "Explain quantum entanglement in simple terms"}
        success, response = self.run_test(
            "AI Chat - Quantum Question", 
            "POST", 
            "api/chat", 
            200, 
            data=chat_data,
            timeout=60  # AI responses can take longer
        )
        
        if success and response:
            if 'response' in response and len(response['response']) > 10:
                print("✅ AI Chat is working - Got meaningful response")
                return True
            else:
                print("❌ AI Chat response seems empty or invalid")
                return False
        return False

    def test_research_categories(self):
        """Test research categories endpoint"""
        success, response = self.run_test("Research Categories", "GET", "api/research/categories", 200)
        
        if success and response:
            if 'categories' in response and len(response['categories']) > 0:
                print("✅ Research categories loaded successfully")
                return True
            else:
                print("❌ Research categories response invalid")
                return False
        return False

    def test_research_stats(self):
        """Test research statistics endpoint"""
        success, response = self.run_test("Research Statistics", "GET", "api/research/stats", 200)
        
        if success and response:
            if 'total_research' in response:
                print(f"✅ Research stats loaded - Total research: {response['total_research']}")
                return True
            else:
                print("❌ Research stats response invalid")
                return False
        return False

    def test_get_research_data(self):
        """Test getting all research data"""
        success, response = self.run_test("Get Research Data", "GET", "api/research", 200)
        
        if success and isinstance(response, list):
            print(f"✅ Research data loaded - Found {len(response)} items")
            if len(response) > 0:
                # Store first research item ID for delete test
                self.test_research_id = response[0].get('id')
                print(f"   Sample research: {response[0].get('title', 'Unknown')}")
            return True
        else:
            print("❌ Research data response invalid")
            return False

    def test_add_research_data(self):
        """Test adding new research data"""
        new_research = {
            "title": "Test Research - Automated Testing",
            "category": "ai",
            "description": "This is a test research item created during automated testing to verify the API functionality.",
            "findings": "Successfully demonstrated that the research API can create new entries programmatically."
        }
        
        success, response = self.run_test(
            "Add Research Data", 
            "POST", 
            "api/research", 
            200, 
            data=new_research
        )
        
        if success and response:
            if 'id' in response and 'title' in response:
                self.test_research_id = response['id']  # Store for delete test
                print(f"✅ Research added successfully - ID: {response['id']}")
                return True
            else:
                print("❌ Add research response invalid")
                return False
        return False

    def test_delete_research_data(self):
        """Test deleting research data"""
        if not self.test_research_id:
            print("❌ No research ID available for delete test")
            return False
            
        success, response = self.run_test(
            "Delete Research Data", 
            "DELETE", 
            f"api/research/{self.test_research_id}", 
            200
        )
        
        if success and response:
            if 'message' in response and 'deleted' in response['message'].lower():
                print("✅ Research deleted successfully")
                return True
            else:
                print("❌ Delete research response invalid")
                return False
        return False

def main():
    print("🚀 Starting QuantumSpace API Testing...")
    print("=" * 60)
    
    # Initialize tester
    tester = QuantumSpaceAPITester()
    
    # Run all tests
    test_results = []
    
    # Basic endpoint tests
    test_results.append(tester.test_root_endpoint())
    test_results.append(tester.test_health_check())
    
    # Research system tests
    test_results.append(tester.test_research_categories())
    test_results.append(tester.test_research_stats())
    test_results.append(tester.test_get_research_data())
    test_results.append(tester.test_add_research_data())
    test_results.append(tester.test_delete_research_data())
    
    # AI integration test (potentially slow)
    test_results.append(tester.test_ai_chat())
    
    # Print final results
    print("\n" + "=" * 60)
    print("📊 FINAL TEST RESULTS")
    print("=" * 60)
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 ALL TESTS PASSED! Backend is working correctly.")
        return 0
    else:
        failed_tests = tester.tests_run - tester.tests_passed
        print(f"⚠️  {failed_tests} test(s) failed. Check the issues above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())